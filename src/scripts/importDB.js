import {createPool, format} from "mysql";
import * as fs from 'fs';
import {mysqlConfig} from '../common/config';

/*
 Run with:
 node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/importDB.js
 */
*****************************************************
*We never want this to run again against production.*
*This should stop it from compiling.                *
*****************************************************

const botm = createPool(mysqlConfig.botm_pool);

const xavier = createPool(mysqlConfig.root_pool);

async function cleanXavier() {
  console.log('Cleaning & resetting xavier');
  let result = fs.readFileSync(__dirname + '/../common/createDB.sql', 'utf8');
  await queryPool(xavier, result);
}

function queryPool(pool, query, params) {
  return new Promise((resolve, reject) =>
    pool.query(query, params, (err, rows) => {
      if (err || !rows) reject(err);
      else resolve(JSON.parse(JSON.stringify(rows)));
    }));
}

async function import_store() {
  console.log('importing store');
  const stores = [
      [1, 'BOM', 'Book of the Month Club', 101, 1003, 1012],
      [2, 'CBC', 'Children\'s Book of the Month Club', 101, 1003, 1012]],
    matches = [
      [1, 'bookofthemonth\.com', 1],
      [2, 'cbotm', 2],
      [1, 'botm', 3],
      [2, 'childrensbookofthemonth\.com', 4]
    ],
    contents = [
      [1,
        'If you’re an avid reader, one thing is for certain: there are a lot of books out there, and if you just shop the bestseller lists, you’re going to miss many of the best stories. That’s why we work hard to discover and bring well-written, immersive stories that will transport you, give you thrills, and tug at your heartstrings—the types of books that are truly worth reading.',
        'books@bookofthemonth.com',
        'support@bookofthemonth.com',
        'abuse@bookofthemonth.com',
        'privacy@bookofthemonth.com'
      ],
      [2,
        'Like BotM, but for beleaguered parents.',
        null,
        null,
        null,
        null
      ]
    ];
  await queryPool(xavier, 'INSERT store (id, tla, name, plan1_id, plan2_id, plan3_id) VALUES ?;', [stores]);
  await queryPool(xavier, 'INSERT store_match (store_id, regex, position) VALUES ?', [matches]);
  await queryPool(xavier, 'INSERT store_content (store_id, text_data, email_from, email_support, email_abuse, email_privacy) VALUES ?', [contents]);
}

async function import_plans() {
  let plans = await queryPool(botm, 'select id, mmid, name, months, price from plans where id in ' +
    '((select distinct planId from subscriptionDetails union distinct select distinct renewAs from subscriptionDetails));');
  let results = await queryPool(xavier, 'INSERT plan (id, mmid, name, months, price, store_id) VALUES ?;',
    [plans.map(p=>[p['id'], p['mmid'], p['name'], p['months'], p['price'], 1])]);
  console.log('imported ' + results.affectedRows + ' subscription plans');
  plans = [
    [101, '1-MONTH', '<h1><s>$16.99</s></h1><h4>PER MONTH</h4>', 'GET YOUR FIRST MONTH FOR JUST $8.99!',
      "Pay $8.99 today, and enter a recurring 1-month subscription at $16.99 after your first month.",
      1403862, 1, 8.99, 1001, 1],
    [1001, '1-MONTH', '<h1>$16.99</h1><h4>PER MONTH</h4>', 'DEFAULT MONTH-TO-MONTH PRICING',
      "Pay $16.99 per month for a recurring subscription beginning today",
      1403862, 1, 16.99, 1001, 1],
    [1003, '3-MONTH', '<h1>$14.99</h1><h4>PER MONTH</h4>', '(Save 12%)',
      'Pay $44.97 for a recurring 3-month subscription beginning today',
      1403863, 3, 44.97, 1003, 1],
    [1006, '6-MONTH', '<h1>$13.99</h1><h4>PER MONTH</h4>', '(Save 18%)',
      'Pay $83.94 for a recurring 3-month subscription beginning today',
      1407243, 6, 83.94, 1006, 1],
    [1012, '12-MONTH', '<h1>$11.99</h1><h4>PER MONTH</h4>', '(Save 30%)',
      'Pay $143.88 for a recurring 12-month subscription beginning today',
      1403864, 12, 143.88, 1012, 1]
  ];
  await queryPool(xavier, 'INSERT plan (id, name, price_label, price_blurb, description, mmid, months, price, renews_into, store_id) VALUES ?', [plans]);
  console.log('created new default plans');
}

async function import_judge() {
  let result = await queryPool(botm, 'select id, name, role, bio, website, facebook, twitter, tumblr, instagram, pictureFilename as img, isGuest guest from judges;');
  let inserts = result.map(r=>format(
    'INSERT social (website, facebook, twitter, tumblr, instagram) VALUES (?,?,?,?,?)',
    [r['website'], r['facebook'], r['twitter'], r['tumblr'], r['instagram']]));
  let insertResults = await queryPool(xavier, inserts.join(';'));
  result = await queryPool(xavier, 'INSERT judge (id, name, img, role, bio, guest, store_id, social_id) values ?',
    [result.map((r, i)=>[r['id'], r['name'], r['img'], r['role'], r['bio'], r['guest'], 1, insertResults[i].insertId])]);
  console.log('imported ' + result.affectedRows + ' judges');
}

async function import_product() {
  let result = await queryPool(botm,
    'SELECT id, judgeId, mmid, title, subtitle, clubMonth-1 clubMonth, coverFilename as img, clubYear-2015 clubYear, featuredPosition, ' +
    'IFNULL(releaseDate,\'2016-01-01\') as pub_date, pageCount, summary, summaryTitle, judgeBlurb FROM books;');
  let update = result.map(r=> [r['id'], r['mmid'], r['title'], r['subtitle'], r['pub_date'], r['clubMonth'], r['clubYear'],
    r['pageCount'], r['img'], r['summaryTitle'], r['summary'], r['judgeBlurb'], true, r['featuredPosition'], true, r['judgeId'], 1]
  );
  result = await queryPool(xavier,
    'INSERT product (id, mmid, title, subtitle, pub_date, month, year, ' +
    'pages, img, description_title, description, judge_blurb, featured, position, visible, judge_id, store_id) ' +
    'VALUES ?', [update]);
  console.log('imported ' + result.affectedRows + ' products');
}

async function import_genre() {
  let result = await queryPool(botm, 'select  * from genres;');
  result = await queryPool(xavier, 'INSERT genre (id, label) values ?;',
    [result.map(r=>[r.id, r.label])]);
  console.log('imported ' + result.affectedRows + ' genres');
}

async function import_product_genre() {
  let result = await queryPool(botm, 'select bookId product_id, genreId genre_id from bookGenres;');
  result = await queryPool(xavier, 'INSERT product_genre (product_id, genre_id) values ?;',
    [result.map(r=>[r['product_id'], r['genre_id']])]);
  console.log('imported ' + result.affectedRows + ' product_genres');
}

async function import_author() {
  let result = await queryPool(botm, 'SELECT authorId, authorName as name, pictureFilename as img, bio, website, facebook, twitter, tumblr, instagram FROM authors;');
  let inserts = result.map(r=>format(
    'INSERT social (website, facebook, twitter, tumblr, instagram) VALUES (?,?,?,?,?)',
    [r['website'], r['facebook'], r['twitter'], r['tumblr'], r['instagram']]));
  let insertResults = await queryPool(xavier, inserts.join(';'));
  result = await queryPool(xavier, 'INSERT author (id, name, img, bio, store_id, social_id) values ?;',
    [result.map((r, i)=>[r['id'], r['name'], r['img'], r['bio'], 1, insertResults[i].insertId])]);
  console.log('imported ' + result.affectedRows + ' authors');
}

async function import_product_author() {
  let result = await queryPool(botm, 'SELECT bookId, authorId, authorOrdinal FROM bookAuthors;');
  result = await queryPool(xavier, 'INSERT product_author (product_id, author_id, position) values ?',
    [result.map(r=>[r['bookId'], r['authorId'], ['r.authorOrdinal']])]);
  console.log('imported ' + result.affectedRows + ' product_authors');
}

async function import_member() {
  let statusMap = {'ACTIVE': 'Active', 'INACTIVE': 'Inactive', 'PAUSED': 'Active', 'NEW': 'Pending'};
  let [members, addresses, referCodes] = await Promise.all([
    queryPool(botm,
      'SELECT id, netsuiteId, firstName, lastName, displayName, email, phone, pictureFilename, ' +
      'passwordIdHash, facebookAccessToken, UPPER(memberStatus) status, enrollDate, source, ' +
      'UPPER(accountType) type, canAssignWomensLit, testAccount FROM members'),
    queryPool(botm, 'SELECT * FROM shipAddresses;'),
    queryPool(botm, 'SELECT memberId, referCode FROM referCodes;')]);
  let memberAddressMap = new Map(addresses.map((a, i)=>[a['memberId'], i + 1]));
  let insertAddresses = addresses.map((r, i)=> [i + 1, r['name'], r['line1'], r['line2'], r['city'], r['state'], r['zip']]);
  let referCodeMap = new Map(referCodes.map(r=>[r['memberId'], r['referCode']]));
  members.forEach(m=> {
    if (!memberAddressMap.get(m['id'])) {
      insertAddresses.push([insertAddresses.length + 1, m['firstName'] + ' ' + m['lastName'], null, null, null, null, null]);
      memberAddressMap.set(m['id'], addresses.length);
    }
  });
  let count = await queryPool(xavier, 'INSERT address (id, name, street1, street2, city, state, zip) VALUES ?', [insertAddresses]);
  console.log('imported ' + count.affectedRows + ' addresses');
  count = await queryPool(xavier, 'INSERT member (id, netsuite_id, store_id, first_name, last_name, display_name, email, phone, ' +
    'status, type, enroll_date, picture_url, source, social_id, address_id, password_hash, refer_code, test) VALUES ?',
    [members.map(r=> [r['id'], r['netsuiteId'], 1, r['firstName'], r['lastName'], r['displayName'], r['email'],
      r['phone'], statusMap[r['status']], r['type'], r['enrollDate'], r['pictureFilename'], r['source'], null,
      memberAddressMap.get(r['id']), r['passwordIdHash'],
      referCodeMap.get(r['id']) || Math.random().toString(36).slice(2), r['testAccount']])]);
  console.log('imported ' + count.affectedRows + ' members');
}

async function import_box_history() {
  let [box_history, tracking] = await Promise.all([queryPool(botm,
    `select mb.memberId memberId, mb.bookId productId, mb.isBOM special, mb.orderMonth-1 month, mb.orderYear-2015 year,
	    mop.productPrice price, IFNULL(mop.productTaxRate,0)*0.01 taxRate, if(mo.orderStatus = 'SHIPPED', true, false) shipped,
	    IFNULL(max(mo.shipDate),max(mo.billDate)) shipDate
    from memberBox mb 
    inner join memberOrders mo on 
	    mb.orderMonth = mo.orderMonth and
      mb.orderYear = mo.orderYear and
      mb.memberId = mo.memberId	
    inner join memberOrderProducts mop on
	    mo.orderId = mop.orderId and
      mb.bookId = mop.productId
    WHERE 
      mop.productType = 2
    GROUP BY
	    mb.memberId, mb.orderYear, mb.orderMonth, mb.bookId;`),
    queryPool(botm, 'select memberId, trackingNumber, orderYear-2015 orderYear, orderMonth-1 orderMonth from shipTracking')]);
  let trackingMap = new Map(tracking.map(t=>[t['memberId'] + ':' + t['orderYear'] + ':' + t['orderMonth'], t['trackingNumber']]));
  let result = await queryPool(xavier,
    'INSERT box (member_id, product_id, special, month, year, price, tax_rate, shipped, date_shipped, tracking_number) VALUES ?',
    [box_history.map(b=>[b['memberId'], b['productId'], b['special'], b['month'], b['year'], b['price'], b['taxRate'],
      b['shipped'], b['shipDate'], trackingMap.get(b['memberId'] + ':' + b['year'] + ':' + b['month'])])]);
  console.log('imported ' + result.affectedRows + ' box entries');
}

async function import_subscription_history() {
  let plans = await queryPool(xavier, 'SELECT id FROM plan;');
  let planSet = new Set(plans.map(p=>p['id']));
  let subscriptionHistory = await queryPool(botm,
    `select sd.memberId memberId,
    p.id planId,
    EXTRACT(MONTH FROM date_sub(sd.planExpiration, INTERVAL (p.months+sd.skippedMonth) MONTH))-1 firstMonth,
    GREATEST(EXTRACT(YEAR FROM date_sub(sd.planExpiration, INTERVAL (p.months+sd.skippedMonth) MONTH))-2015,0) firstYear,
    EXTRACT(MONTH FROM sd.planExpiration)-1 lastMonth,
    GREATEST(EXTRACT(YEAR FROM sd.planExpiration)-2015,0) lastYear,
    sd.skippedMonth monthsSkipped,
    o.price price,
    o.taxRate taxRate,
    sd.planAutoRenew willRenew,
    sd.renewAs renewalPlanId
  FROM subscriptionDetails sd
  INNER JOIN plans p on p.id = sd.planId
  INNER JOIN members m on m.id = sd.memberId
  LEFT JOIN
  (SELECT mo.memberId memberId, mo.orderYear year, mo.orderMonth month, mop.productId planId, mop.productPrice price, mop.productTaxRate taxRate
  FROM memberOrders mo INNER JOIN memberOrderProducts mop ON mo.orderId = mop.orderId
  WHERE mop.productType = 1) o
  ON sd.planId = o.planId AND sd.memberId = o.memberId AND
  EXTRACT(MONTH FROM date_sub(sd.planExpiration, INTERVAL (p.months+sd.skippedMonth) MONTH)) = o.month AND
  EXTRACT(YEAR FROM date_sub(sd.planExpiration, INTERVAL (p.months+sd.skippedMonth) MONTH)) = o.year
  WHERE m.memberStatus in ('ACTIVE','PAUSED');`);
  let result = await queryPool(xavier,
    'INSERT IGNORE subscription (member_id, store_id, plan_id, first_month, first_year, last_month, last_year, months_skipped, ' +
    'price, tax_rate, will_renew, renewal_plan_id) VALUES ?', [subscriptionHistory.map(s=>
      [s['memberId'], 1, s['planId'], s['firstMonth'], s['firstYear'], s['lastMonth'], s['lastYear'], s['monthsSkipped'],
        s['price'], s['taxRate'], s['willRenew'], planSet.has(s['renewalPlanId']) ? s['renewalPlanId'] : null])]);
  console.log('imported ' + result.affectedRows + ' subscription entries posts');
}

async function import_order_history() {
  const t = ['', 'Subscription', 'Book', '', 'Subscription Modification'];
  let results = await Promise.all([
    queryPool(botm, 'SELECT orderId, memberId, billDate, orderStatus FROM memberOrders;'),
    queryPool(botm, 'SELECT orderId, productId, productPrice, productTaxRate, productType FROM memberOrderProducts;'),
    queryPool(xavier, 'SELECT id FROM member;')]);
  let memberSet = new Set(results[2].map(r=>r['id']));
  let orders = results[0].map((r, i)=>[i + 1, r['orderId'], r['memberId'], r['billDate'], r['orderStatus']]).filter(o=>memberSet.has(o[2]));
  let orderMap = results[0].reduce((m, r, i)=> {
    if (memberSet.has(r['memberId'])) m[r['orderId']] = i + 1;
    return m;
  }, {});
  let items = results[1]
    .map((r, i)=>[i + 1, orderMap[r['orderId']], r['productId'], t[r['productType']], r['price'], r['taxRates']])
    .filter(r=>r[1] && r[1] > 0);
  let result = await queryPool(xavier, 'INSERT order_history (id, label, member_id, date_created, status) values ?;', [orders]);
  console.log('imported ' + result.affectedRows + ' order histories');
  result = await queryPool(xavier, 'INSERT order_history_item (id,order_history_id,product_id,type,price,tax_rate) values ?;', [items]);
  console.log('imported ' + result.affectedRows + ' order history items');
}

async function import_magazine() {
  let result = await queryPool(botm, 'SELECT id, title, subtitle, summary, coverFilename, postFilename, ' +
    'author, IF(isVideo <> 1, videoUrl, null) video, date, isPublished FROM magazinePosts;');
  let posts = result.map(r=>[r['id'], r['title'], r['subtitle'], r['summary'], r['coverFilename'],
    r['postFilename'], r['author'], r['video'], r['date'], r['isPublished'], 1]);
  result = await queryPool(xavier, 'INSERT magazine ' +
    '(id, title, subtitle, summary, cover_img, post_img, author, youtube_link, live_date, visible, store_id) ' +
    'VALUES ?', [posts]);
  console.log('imported ' + result.affectedRows + ' magazine posts');
}

async function import_discussions() {
  let messages = await queryPool(botm, 'SELECT id, discussionId, sequence, indent, memberId, datePosted, title, body, visible FROM messages;');
  let results = await queryPool(botm, 'SELECT id, bookId FROM discussions;'), bookMap = {};
  results.forEach(r=>bookMap[r['id']] = r['bookId']);
  results = await queryPool(xavier, 'INSERT discussion ' +
    '(id, thread_id, product_id, member_id, sequence, indent, date_posted, title, body, visible) ' +
    'VALUES ?', [messages.map(r=>[
    r['id'], r['discussionId'], bookMap[r['discussionId']], r['memberId'], r['sequence'], r['indent'], r['datePosted'],
    r['title'], r['body'], r['visible']
  ])]);
  console.log('imported ' + results.affectedRows + ' replies');
  let discussions = await queryPool(botm, 'SELECT id, bookId, memberId, datePosted, title, body, visible FROM discussions;');
  results = await queryPool(xavier, 'INSERT discussion (thread_id, product_id, member_id, sequence, indent, date_posted, title, body, visible) ' +
    'VALUES ?', [discussions.map(r=>[r['id'], r['bookId'], r['memberId'], 0, 0, r['datePosted'], r['title'], r['body'], r['visible']
  ])]);
  console.log('imported ' + results.affectedRows + ' discussions');
}

async function import_likes() {
  let mLikes = await queryPool(botm, 'SELECT messageId, memberId FROM memberMessageRating WHERE thumbsUp;');
  let [dIds, m] = await Promise.all([
    queryPool(xavier, 'SELECT id FROM discussion WHERE id IN (?)', [mLikes.map(r=>r['messageId'])]),
    queryPool(xavier, 'SELECT id FROM member WHERE id IN (?)', [mLikes.map(r=>r['memberId'])])
  ]);
  let rSet = new Set(dIds.map(d=>d['id'])), mSet = new Set(m.map(m=>m['id']));
  let results = await queryPool(xavier, 'INSERT IGNORE discussion_like (member_id, discussion_id) VALUES ?',
    [mLikes.filter(r=>mSet.has(r['memberId']) && rSet.has(r['messageId'])).map(r=>[r['memberId'], r['messageId']])]);
  console.log('imported ' + results.affectedRows + ' reply likes');
  let dLikes = await queryPool(botm, 'SELECT discussionId, memberId FROM memberDiscussionRating WHERE thumbsUp;');
  let [m2,d] = await Promise.all([
    queryPool(xavier, 'SELECT id FROM member WHERE id IN (?)', [dLikes.map(r=>r['memberId'])]),
    queryPool(xavier, 'SELECT thread_id, id FROM discussion WHERE indent = 0 AND sequence = 0;')
  ]);
  let dMap = new Map(d.map(d=>[d['thread_id'], d['id']]));
  mSet = new Set(m2.map(m=>m['id']));
  results = await queryPool(xavier, 'INSERT discussion_like (member_id, discussion_id) VALUES ?',
    [dLikes.filter(r=>mSet.has(r['memberId']) && dMap.get(r['discussionId'])).map(r=>[r['memberId'], dMap.get(r['discussionId'])])]);
  console.log('imported ' + results.affectedRows + ' discussion likes');
}

async function import_tax_rates() {
    let rates = await queryPool(botm, 'SELECT lpad(zipCode,5,\'0\') zip, 0.01*rate rate FROM taxRates;');
  let resultMap = new Map(rates.map(r=>[r['zip'], r['rate']]));
  let results = await queryPool(xavier, 'INSERT zip_tax (zip5, rate) VALUES ?', [[...resultMap.entries()]]);
  console.log('imported ' + results.affectedRows + ' tax rates');
}

async function import_gifts() {
  let gifts = await queryPool(botm, 'SELECT id, giftCode, voucherCode, message, planId, giverFName, giverLName, ' +
    'giverEmail, receiverFName, receiverLName, receiverEmail, deliveryMethod, transId, transAmt, purchaseDate,' +
    'deliveryDate, deliveryEmailCode, isRedeemed FROM gifts;');
  let results = await queryPool(xavier,
    'INSERT gift (id, gift_code, voucher_code, message, plan_id, giver_name, giver_email, recipient_name, recipient_email, ' +
    'delivery_method, bt_transaction_id, bt_transaction_amt, purchase_date, delivery_date, delivered, redeemed) ' +
    'values ?',
    [gifts.map(g=>[g['id'], g['giftCode'], g['voucherCode'], g['message'], g['planId'], g['giverFName'] + ' ' + g['giverLName'],
      g['giverEmail'], g['receiverFName'] + ' ' + g['receiverLName'], g['receiverEmail'], g['deliveryMethod'], g['transId'],
      g['transAmt'], g['purchaseDate'], g['deliveryDate'], g['deliveryEmailCode'] ? true : false, g['isRedeemed']])]);
  console.log('imported ' + results.affectedRows + ' gifts.');
}

async function import_credits() {
  let credits = await queryPool(botm, 'SELECT memberId, creditsAvailable FROM memberCredits;');
  let results = await queryPool(xavier, 'INSERT credit_history (member_id, delta, source) VALUES ?;',
    [credits.map(c=>[c['memberId'], c['creditsAvailable'], 'Legacy system import.'])]);
  console.log('imported ' + results.affectedRows + ' credit entries.');
}

async function import_leads() {
  let maxLead = await queryPool(botm, 'SELECT MAX(id) maxId FROM joinLeads;');
//  let leads = await queryPool(botm, 'SELECT id, email, date, source FROM joinLeads;');
//  let results = await queryPool(xavier, 'INSERT lead (store_id, id, email, source, first_seen) VALUES ?;',
//    [leads.map(l=>[1, l['id'], l['email'], l['source'], l['date']])]);
  await queryPool(xavier, 'ALTER TABLE lead AUTO_INCREMENT = ?;', [maxLead[0]['maxId']]);
  console.log('started leads table autoincrement at: ' + (maxLead[0]['maxId'] + 1000));
}

async function run() {
  try {
    await cleanXavier();
    await import_store();
    await import_plans();
    await import_judge();
    await import_product();
    await import_genre();
    await import_product_genre();
    await import_author();
    await import_product_author();
    await import_member();
    await import_box_history();
    await import_subscription_history();
    await import_discussions();
    await import_likes();
    await import_magazine();
    await import_tax_rates();
    await import_gifts();
    await import_leads();
    await import_credits();
    await import_order_history();
  } catch (e) {
    console.error(e);
  } finally {
    xavier.end();
    botm.end();
  }
}

run();
