import {
  readQuery,
  writeQuery,
  beginTransaction,
  rollback,
  commitTransaction,
  getWriteConn,
  queryConnection,
  releaseConnection
} from '../utils/db';
import {sendDiscussionReply} from '../email/discussionReply';
import * as commonmark from 'commonmark';

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer({safe: true, smart: true});


function buildDiscussion(discussion, node = discussion.shift()) {
  while (discussion.length > 0 && discussion[0]['indent'] > node['indent']) {
    let child = discussion.shift();
    node['replies'].push(child);
    buildDiscussion(discussion, child);
  }
  return node;
}

function setReplyCount(discussion) {
  if (discussion.replies.length === 0) discussion.reply_count = 0;
  else discussion.reply_count = discussion.replies.reduce((p, c)=>p + setReplyCount(c), 0);
  return discussion.reply_count + 1;
}

function setModifyDate(discussion) {
  discussion.date_modified = discussion.replies.reduce((p, c)=>Math.max(p, setModifyDate(c)), discussion.date_posted);
  return discussion.date_modified;
}

function sortByNewness(discussion) {
  discussion.replies.forEach(sortByNewness);
  discussion.replies.sort((a, b)=>b.date_modified - a.date_modified);
}

export async function fleshOutDiscussions(discs, memberId) {
  let [likes, members, products] = await Promise.all([
    readQuery('SELECT discussion_id, count(*) likes FROM discussion_like WHERE discussion_id IN (?) GROUP BY discussion_id;', [discs.map(d=>d['id'])]),
    readQuery('SELECT m.id id, m.display_name display_name, m.picture_url picture_url, m.type type, count(distinct d.id) activity ' +
      'FROM member m INNER JOIN discussion d ON m.id = d.member_id WHERE m.id IN (?) GROUP BY m.id;', [discs.map(d=>d['member_id'])]),
    readQuery('SELECT id, title FROM product WHERE id IN (?)', [discs.map(d=>d['product_id'])])
  ]), likeMap = {}, memberMap = {}, discussions = [], memberLikes = [], memberLikeMap = {}, productMap = {};
  if (memberId) memberLikes = await readQuery('SELECT discussion_id FROM discussion_like WHERE member_id = ?', memberId);
  likes.forEach(l=>likeMap[l['discussion_id']] = l['likes']);
  members.forEach(m=>memberMap[m['id']] = m);
  products.forEach(p=>productMap[p['id']] = p['title']);
  memberLikes.forEach(ml=>memberLikeMap[ml['discussion_id']] = true);
  discs.forEach(d=> {
    d['body_raw'] = '' + d['body'];
    d['title_raw'] = d['title'];
    if (d['title'] && d['title'].length > 0) d['title'] = writer.render(reader.parse(d['title']));
    d['body'] = writer.render(reader.parse(d['body']));
    d['like_count'] = likeMap[d['id']] || 0;
    d['product_title'] = productMap[d['product_id']];
    if (memberId) d['liked'] = memberLikeMap[d['id']] ? true : false;
    d['member'] = memberMap[d['member_id']] || {
        display_name: 'Anonymous',
        picture_url: 'placeholder.jpg',
        type: 'Member'
      };
    d['date_posted'] = new Date(d['date_posted']).getTime();
    d['replies'] = [];
  });
  discs.forEach(d=> {
    if (discussions.length === 0 || discussions[discussions.length - 1][0]['thread_id'] !== d['thread_id'])
      discussions.push([]);
    discussions[discussions.length - 1].push(d);
  });
  discussions = discussions.map(d=>buildDiscussion(d));
  discussions.forEach(setReplyCount);
  discussions.forEach(setModifyDate);
  discussions.forEach(sortByNewness);
  discs.forEach(d=> {
    if (d['indent'] > 0) delete d['title'];
    delete d['thread_id'];
    delete d['sequence'];
    delete d['indent'];
    delete d['member_id'];
    delete d['visible'];
  });
  return discussions;
}

export async function getDiscussionsByProduct(ids, memberId) {
  let discussions = await readQuery('SELECT * FROM discussion WHERE product_id in (?) ORDER BY thread_id DESC, sequence;', [ids]);
  if (discussions.length > 0) return await fleshOutDiscussions(discussions, memberId);
  else return [];
}

export async function getThreadById(id, memberId) {
  let thread = await readQuery('SELECT * FROM discussion WHERE thread_id = ? ORDER BY sequence;', [id]);
  if (thread.length > 0) return await fleshOutDiscussions(thread, memberId);
  else return [];
}

export async function replyDiscussion(discussionId, body, memberId, display_name) {
  let conn = null, replyTo = null;
  try {
    replyTo = await readQuery('SELECT member_id, thread_id, product_id, sequence, indent FROM discussion WHERE id = ?;', [discussionId]);
    if (replyTo.length !== 1) return false;
    conn = await getWriteConn();
    await beginTransaction(conn);
    await queryConnection(conn, 'UPDATE discussion SET sequence = sequence + 1000000 WHERE thread_id = ? AND sequence > ?;',
      [replyTo[0]['thread_id'], replyTo[0]['sequence']]);
    await queryConnection(conn, 'UPDATE discussion SET sequence = sequence -999999 WHERE thread_id = ? AND sequence > ?;',
      [replyTo[0]['thread_id'], replyTo[0]['sequence']]);
    await queryConnection(conn,
      'INSERT discussion (thread_id, product_id, member_id, sequence, indent, body) VALUES (?)',
      [[replyTo[0]['thread_id'], replyTo[0]['product_id'], memberId,
        replyTo[0]['sequence'] + 1, replyTo[0]['indent'] + 1, body]]);
    await commitTransaction(conn);
    return replyTo[0]['thread_id'];
  } catch (e) {
    console.error(e);
    if (conn) await rollback(conn);
    throw e;
  } finally {
    try {
      if (conn) await releaseConnection(conn);
      if (replyTo) {
        let [[email],[title]] = await Promise.all([
          readQuery('SELECT email FROM member WHERE id = ?', [replyTo[0]['member_id']]),
          readQuery('SELECT title FROM discussion WHERE sequence = 0 AND thread_id = ?', [replyTo[0]['thread_id']])]);
        await sendDiscussionReply(email['email'], display_name, title['title'], replyTo[0]['product_id']);
      }
    } catch (e) {
      console.error('Failed to send e-mail to poster being replied to: ' + e);
    }
  }
}

export async function editDiscussion(discussionId, body, title, memberId) {
  let [ignore, thread] = await Promise.all([
    await writeQuery('UPDATE discussion SET body = ?, title = ? WHERE id = ? AND member_id = ?', [body, title, discussionId, memberId]),
    await readQuery('SELECT thread_id FROM discussion WHERE id = ?', [discussionId])
  ]);
  if (thread.length === 1) return thread[0]['thread_id'];
  else return false;
}

export async function postDiscussion(body, title, productId, memberId) {
  let [product,newThread] = await Promise.all([
    readQuery('SELECT id FROM product WHERE id = ?;', [productId]),
    readQuery('SELECT MAX(thread_id)+1 newThreadId FROM discussion;')]);
  if (product.length === 0) throw new Error('product_id not found');
  let result = await writeQuery('INSERT discussion (thread_id, product_id, member_id, sequence, indent, title, body) ' +
    'VALUES (?, ?, ?, 0, 0, ?, ?);', [newThread[0]['newThreadId'], productId, memberId, title, body]);
  await writeQuery('INSERT IGNORE discussion_like (member_id, discussion_id) VALUES (?,?);', [memberId, result.insertId]);
  let newPost = await readQuery('SELECT thread_id FROM discussion WHERE id = ?', result.insertId);
  return await getThreadById(newPost[0]['thread_id'], memberId);
}

export async function likeDiscussion(discussionId, memberId) {
  try {
    await writeQuery('INSERT IGNORE discussion_like (discussion_id, member_id) VALUES (?)', [[discussionId, memberId]]);
    return null;
  } catch (e) {
    try {
      let [discussionExists, memberExists] = await Promise.all([
        readQuery('SELECT * FROM discussion WHERE id = ?', [discussionId]),
        readQuery('SELECT * FROM member WHERE id = ?', [memberId])
      ]);
      if (discussionExists.length !== 1) return {code: 400, message: 'Discussion does not exist.', body: null};
      if (memberExists.length !== 1) return {code: 400, message: 'Member does not exist.', body: null};
    } catch (e2) {
      return null;
    }
  }
}

export async function unlikeDiscussion(discussionId, memberId) {
  try {
    await writeQuery('DELETE FROM discussion_like WHERE discussion_id = ? AND member_id = ?;', [discussionId, memberId]);
  } catch (e) {
    return {code: 400, message: 'Unspecified server error.', body: e}
  }
}
