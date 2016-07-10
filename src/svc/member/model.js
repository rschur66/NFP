import crypto from "crypto";
import {signature_secret} from "../../common/credentials";
import dateFormat from "dateformat";
import {addPaymentMethod, authPurchase, cancelTransaction} from "../utils/braintree.js";
import {buildEnrollment, exportEnrollment, buildPlanPurchase, exportPlanPurchase} from "../utils/sqs";
import {getTaxRate} from "../commerce/model.js";
import {sendWelcomeNonPicking} from "../email/welcomeNonPicking";
import {sendWelcomeOpenCycle} from "../email/welcomeOpenCycle";
import {sendReferConfirmation} from "../email/referConfirmation";
import {sendWelcomeBack} from "../email/welcomeBack";
import {
  readQuery,
  writeQuery,
  getWriteConn,
  queryConnection,
  beginTransaction,
  commitTransaction,
  rollback,
  releaseConnection
} from "../utils/db";

export const login_duration = 1000 * 60 * 60 * 24;
const attribution_duration = 1000 * 60 * 60 * 24 * 30;

export function signValue(value, timestamp) {
  return crypto
    .createHmac('sha256', signature_secret)
    .update(value + ':' + timestamp)
    .digest('base64')
    .toString()
    .replace(/\=+$/, '');
}

async function fleshOut(member) {
  let [address,box,social,tax,subscriptions,plans,credits, order_history] = await Promise.all([
      readQuery('SELECT name, street1, street2, city, state, zip FROM address WHERE id = ?;', [member['address_id']]),
      readQuery('SELECT product_id, special, year, month, price, tax_rate, credit, shipped, date_shipped, tracking_number, swag ' +
        'FROM box WHERE member_id = ? ORDER BY year DESC, month DESC, special DESC;', [member['id']]),
      readQuery('SELECT * FROM social WHERE id = ?;', [member['social_id']]),
      readQuery('SELECT rate FROM zip_tax WHERE zip5 = (SELECT LEFT(zip,5) FROM address WHERE id = ? LIMIT 1);', [member['address_id']]),
      readQuery(
        'SELECT plan_id, first_month, first_year, last_month, last_year, months_skipped, IFNULL(price,0) price, ' +
        'IFNULL(tax_rate,0) tax_rate, will_renew, renewal_plan_id ' +
        'FROM subscription WHERE member_id = ? ORDER BY last_year DESC, last_month DESC;', [member['id']]),
      readQuery(
        'SELECT id, name, price, months FROM plan WHERE id in (SELECT plan_id FROM subscription WHERE member_id = ? ' +
        'UNION ALL SELECT renewal_plan_id FROM subscription WHERE member_id = ?)', [member['id'], member['id']]),
      readQuery('SELECT delta, source, date_time FROM credit_history WHERE member_id = ? ORDER BY date_time DESC;', [member['id']]),
      readQuery('select oh.id id, date_created, EXTRACT (month FROM date_created)-1 month, EXTRACT (year FROM date_created)-2015 year,' +
        'status, type, product_id, ohi.price price, ohi.tax_rate tax_rate, pl.name name, pr.title title from order_history oh ' +
        'left join order_history_item ohi on oh.id = ohi.order_history_id ' +
        'left join plan pl on ohi.type IN (\'Subscription\', \'Subscription Modification\') AND pl.id = ohi.product_id ' +
        'left join product pr on ohi.type = \'Book\' AND pr.id = ohi.product_id ' +
        'where member_id = ? and status in (\'Shipped\', \'Charged\', \'Free\', \'Settled\', \'Skipped\');', [member['id']])
    ]),
    this_month = (new Date()).getMonth(), this_year = (new Date()).getYear() - 115,
    next = new Date(new Date().setMonth(this_month + 1)), next_month = next.getMonth(), next_year = next.getYear() - 115;
  let planMap = new Map(plans.map(p=>[p['id'], p]));
  member.tax_rate = tax.length > 0 ? tax[0]['rate'] : 0;
  member.address = address[0] || {};
  member.box = {
    books: new Array(1),
    swag: [],
    prices: [0],
    swag_prices: [],
    credits: [0],
    tax_rate: 0.00,
    tracking_number: null,
    date_shipped: null
  };
  member.box_future = {
    books: new Array(1),
    swag: [],
    prices: [0],
    swag_prices: [],
    credits: [0],
    tax_rate: 0.00,
    tracking_number: null,
    date_shipped: null
  };
  member.credit_history = credits;
  member.credits = credits.reduce((t, c)=>t + c['delta'], 0);
  member.box_history = [];
  subscriptions.forEach(s=> {
    s['plan'] = planMap.get(s['plan_id']);
    s['renewal_plan'] = planMap.get(s['renewal_plan_id']);
    delete s['renewal_plan_id'];
    delete s['plan_id'];
  });
  if (subscriptions[0] && (subscriptions[0]['last_year'] > this_year ||
    (subscriptions[0]['last_year'] == this_year && subscriptions[0]['last_month'] >= this_month))) {
    member.subscription = subscriptions[0];
    member.subscription_history = subscriptions.slice(1);
  } else {
    member.subscription = null;
    member.subscription_history = subscriptions;
  }
  member.show_future_box = false;
  member.can_pick = true;
  let month_fill = [this_year, this_month];
  box.forEach(b=> {
    if (b['year'] < month_fill[0] || (b['year'] === month_fill[0] && b['month'] <= month_fill[1]))
      month_fill = [b['year'], b['month']];
    if (b['year'] === this_year && b['month'] === this_month) {
      if (!member.box[0] && b['special']) member.box.books[0] = b['product_id'];
      else {
        if (b['swag']) {
          member.box.swag.push(b['product_id']);
          member.box.swag_prices.push(b['price']);
          console.log('member.box.swag', member.box.swag);
          console.log('member.box.swag_prices', member.box.swag_prices);
        } else {
          member.box.books.push(b['product_id']);
          member.box.prices.push(b['price']);
          member.box.credits.push(b['credit']);
        }
      }
      if (b['tax_rate']) member.box['tax_rate'] = b['tax_rate'];
      if (b['date_shipped']) member.box['date_shipped'] = new Date(b['date_shipped']).getTime();
      if (b['tracking_number']) member.box['tracking_number'] = b['tracking_number'];
      member.can_pick = member.can_pick && !b['shipped'];
    } else if (b['year'] === next_year && b['month'] === next_month) {
      if (!member.box_future[0] && b['special']) member.box_future[0] = b['product_id'];
      else {
        if (b['swag']) {
          member.box_future.swag.push(b['product_id']);
          member.box_future.swag_prices.push(b['price']);
        } else {
          member.box_future.books.push(b['product_id']);
          member.box_future.prices.push(b['price']);
          member.box_future.credits.push(b['credit']);
        }
      }
      if (b['tax_rate']) member.box['tax_rate'] = b['tax_rate'];
      if (b['date_shipped']) member.box['date_shipped'] = new Date(b['date_shipped']).getTime();
      if (b['tracking_number']) member.box['tracking_number'] = b['tracking_number'];
      member.show_future_box = true;
    } else {
      member.box_history[b['year']] = member.box_history[b['year']] || [];
      member.box_history[b['year']][b['month']] = member.box_history[b['year']][b['month']] ||
        {
          books: [],
          swag: [],
          prices: [],
          swag_prices: [],
          credits: [],
          tracking_number: null,
          date_shipped: null
        };
      if (b['swag']) {
        member.box_history[b['year']][b['month']]['swag'].push(b['product_id']);
        member.box_history[b['year']][b['month']]['swag_prices'].push(b['price']);
      } else {
        member.box_history[b['year']][b['month']]['books'].push(b['product_id']);
        member.box_history[b['year']][b['month']]['prices'].push(b['price']);
        member.box_history[b['year']][b['month']]['credits'].push(b['credit']);
      }
      if (b['tax_rate']) member.box['tax_rate'] = b['tax_rate'];
      if (b['date_shipped']) member.box_history[b['year']][b['month']]['date_shipped'] = new Date(b['date_shipped']).getTime();
      if (b['tracking_number']) member.box_history[b['year']][b['month']]['tracking_number'] = b['tracking_number'];
    }
  });
  while (month_fill[0] < this_year || (month_fill[0] == this_year && month_fill[1] <= this_month) && member.box_history.length > 0) {
    member.box_history[month_fill[0]] = member.box_history[month_fill[0]] || [];
    member.box_history[month_fill[0]][month_fill[1]] = member.box_history[month_fill[0]][month_fill[1]] || [];
    month_fill[1]++;
    if (month_fill[1] > 11) {
      month_fill[1] = 0;
      month_fill[0]++;
    }
  }
  let skipSet = new Set(order_history.map(oh=>oh['status'] === 'Skipped' ? oh['year'] * 12 + oh['month'] : null).filter(s=>s));
  member.order_history = Object.values(order_history.reduce((p, oh)=> {
    if (oh['type'] === 'Book' && skipSet.has(oh['year'] * 12 + oh['month'])) return p;
    p[oh['id']] = p[oh['id']] || {
        id: oh['id'],
        date_created: oh['date_created'],
        total: 0.00,
        tax_rate: oh['tax_rate'] || 0.00
      };
    p[oh['id']]['total'] += (oh['price'] || 0);
    if (oh['type'] === 'Book')
      p[oh['id']]['label'] = dateFormat(new Date(oh['date_created']), 'mmmm') + ' Box';
    else if (oh['status'] === 'Skipped')
      p[oh['id']]['label'] = dateFormat(new Date(oh['date_created']), 'mmmm') + ' Box Skipped';
    else {
      p[oh['id']]['label'] = oh['name'] + ' Subscription';
    }
    if (oh['type'] === 'Book') {
      p[oh['id']]['books'] = p[oh['id']]['books'] || [];
      p[oh['id']]['books'].push(oh['title']);
    }
    return p;
  }, {})).sort((a, b)=>new Date(b['date_created']).getTime() - new Date(a['date_created']).getTime());
  member.enroll_date = new Date(member['enroll_date']).getTime();
  member.social = social.length > 0 ? social[0] : {
    website: null,
    facebook: null,
    twitter: null,
    tumblr: null,
    instagram: null
  };
  delete member['social_id'];
  delete member['address_id'];
  delete member['subscription_id'];
  delete member['store_id'];
  return member;
}

export async function findMemberByEmailPassword(store_id, email, password) {
  let query =
    'SELECT * FROM member WHERE store_id = ? AND email = ? '
    + (password ? ' AND password_hash = SHA2(CONCAT(?, id),224);' : ';');
  let result = await readQuery(query, [store_id, email, password]);
  if (result.length === 0) return null;
  return await fleshOut(result[0]);
}

export async function findMemberById(store_id, member_id) {
  let result = await readQuery('SELECT * FROM member WHERE store_id = ? AND id = ?;', [store_id, member_id]);
  if (result.length === 0) return null;
  return await fleshOut(result[0]);
}

export async function findMemberByToken(store_id, token) {
  let result = await readQuery('SELECT * FROM member WHERE store_id = ? AND id = ' +
    '(SELECT member_id FROM password_reset WHERE token = ? AND time_to_sec(timediff(current_timestamp, when_created)) < 3600);',
    [store_id, token]);
  if (result.length === 0) return null;
  return await fleshOut(result[0]);
}

export async function captureSource(req, res, next) {
  let referCode = req.query['referCode'];
  if (referCode) res.cookie('referCode', referCode, {maxAge: attribution_duration, httpOnly: true});
  next();
}

export async function attachMember(req, res, next) {
  let
    member_id = req.member ? req.member.id : null,
    store_id = req.store ? req.store.id : null,
    email = req.query.email || (req['cookies'] && req['cookies']['email'] ? req['cookies']['email'] : null),
    password = req.query.password,
    timestamp = req['cookies'] && req['cookies'].timestamp ? req['cookies'].timestamp : Date.now(),
    hash = req['cookies'] && req['cookies']['session'] ? req['cookies']['session'] : null,
    token = req.query.token,
    time = req.query.time,
    auth = req.query.auth;
  member_id = req.query.member_id || member_id;
  try {
    if (store_id && member_id && auth && time && signValue(member_id, time) === auth.replace(/ /g, '+')) {
      req.member = await findMemberById(store_id, member_id);
    } else if (member_id && store_id) {
      req.member = await findMemberById(store_id, member_id)
    } else if (store_id && token) {
      req.member = await findMemberByToken(store_id, token);
    } else if (store_id && email && password) {
      req.member = await findMemberByEmailPassword(store_id, email, password);
    } else if (store_id && (Date.now() - (timestamp || 0 ) < login_duration) && signValue(email, timestamp) === hash) {
      req.member = await findMemberByEmailPassword(store_id, email);
    }
  } catch (e) {
    console.error(e);
  }
  if (req.member) {
    timestamp = Date.now();
    res.cookie('email', req.member['email'], {maxAge: login_duration, httpOnly: true});
    res.cookie('timestamp', timestamp, {maxAge: login_duration, httpOnly: true});
    res.cookie('session', signValue(req.member['email'], timestamp), {maxAge: login_duration, httpOnly: true});
  }
  next();
}

async function updateOrCreateAddress(member_id, address_id, address) {
  if (address && typeof address === 'object' && Object.keys(address).length > 0) {
    if (address_id) {
      await writeQuery('UPDATE address SET ? WHERE id = ?', [address, address_id]);
    } else if (address['street1'] && address['city'] && address['state'] && address['zip']) {
      let conn = null;
      try {
        conn = await getWriteConn();
        await beginTransaction(conn);
        let result = await queryConnection(conn, 'INSERT address (street1, street2, city, state, zip) values (?,?,?,?,?)',
          [address['street1'], address['street1'], address['city'], address['state'], address['zip']]);
        await queryConnection(conn, 'UPDATE member SET address_id = ? WHERE id = ?', [result.insertId, member_id]);
        await commitTransaction(conn);
      } catch (e) {
        if (conn) await releaseConnection(conn);
      } finally {
        if (conn) await releaseConnection(conn);
      }
    }
  }
}

async function updateOrCreateSocial(member_id, social_id, social) {
  if (social && typeof social === 'object' && Object.keys(social).length > 0) {
    if (social_id) {
      await writeQuery('UPDATE social SET ? WHERE id = ?', [social, social_id]);
    } else if (social['website'] || social['facebook'] || social['twitter'] || social['tumblr'] || social['instagram']) {
      let conn = null;
      try {
        conn = await getWriteConn();
        await beginTransaction(conn);
        let result = await queryConnection(conn, 'INSERT social (website, facebook, twitter, tumblr, instagram) values (?,?,?,?,?)',
          [social['website'], social['facebook'], social['twitter'], social['tumblr'], social['instagram']]);
        await queryConnection(conn, 'UPDATE member SET social_id = ? WHERE id = ?', [result.insertId, member_id]);
        await commitTransaction(conn)
      } catch (e) {
        if (conn) await rollback(conn);
      } finally {
        if (conn) await releaseConnection(conn);
      }
    }
  }
}

export async function editMember(id, member, address, social) {
  let result = await readQuery('SELECT id, address_id, social_id FROM member WHERE id = ?', [id]);
  let newPassword = member.password;
  delete member.password;
  if (result.length < 1) return "Member does not exist for write.";
  if (typeof member === 'object' && Object.keys(member).length > 0)
    await writeQuery('UPDATE member SET ? WHERE id = ?', [member, result[0]['id']]);
  await Promise.all([
    updateOrCreateAddress(result[0]['id'], result[0]['address_id'], address),
    updateOrCreateSocial(result[0]['id'], result[0]['social_id'], social)]);
  if (newPassword) await writeQuery('UPDATE member SET password_hash = SHA2(CONCAT(?,id),224) WHERE id = ?;', [newPassword, result[0]['id']]);
  return null;
}

export async function getGiftPlan(gift) {
  let result = await readQuery('SELECT * FROM plan WHERE id = (select plan_id from gift where gift_code = ? AND (redeemed is null or redeemed = 0))', gift);
  return result[0];
}

export async function getGrouponPlan(groupon) {
  let result = await readQuery('SELECT * FROM plan WHERE id = (select plan_id from groupon where groupon_code = ? AND (redeemed is null or redeemed = 0))', groupon);
  return result[0];
}

export async function getPromoPlan(store_id, id, promo) {
  let result = await readQuery('SELECT * FROM plan WHERE store_id = ? AND id = ? AND (promo is null or ( promo = ? AND start_date <= now() AND end_date >= now() ))', [store_id, id, promo || null]);
  return result[0];
}

export function addMonths(this_month, this_year, months) {
  let new_months = 12 * this_year + this_month + months;
  return [Math.floor(new_months / 12), new_months % 12];
}

export async function createNewMember(storeId, ship_date, member, social, address, plan_obj, can_pick, refer_code) {
  let socialId = null, addressId = null, conn = null, plan = null, renewal_plan = null, result = null,
    transaction = null, new_member_id = null, rate = 0, renew = true, referrer = null;
  let this_month = (new Date()).getMonth(), this_year = (new Date()).getYear() - 115;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    if (social && typeof social === 'object' && Object.keys(social).length > 0) {
      result = await queryConnection(conn,
        'INSERT social (website, facebook, twitter, tumblr, instagram) VALUES (?,?,?,?,?);',
        [social['website'], social['facebook'], social['twitter'], social['tumblr'], social['instagram']]);
      socialId = result.insertId;
    }
    if (address && typeof address === 'object' && Object.keys(address).length > 0) {
      result = await queryConnection(conn, 'INSERT address (name, street1, street2, city, state, zip) VALUES (?)',
        [[address['name'], address['street1'], address['street2'], address['city'], address['state'], address['zip']]]);
      addressId = result.insertId;
    }
    if (refer_code) {
      let referrers = await queryConnection(conn, 'SELECT id, first_name, email FROM member WHERE refer_code = ?', [refer_code]),
        referrer = referrers[0];
      if (referrer) {
        await queryConnection(conn, 'INSERT credit_history (member_id, delta, source) VALUES (?,1,?);',
          [referrer['id'], 'Credit for referring new member.']);
        await sendReferConfirmation(referrer['first_name'], member['first_name'], referrer['email']);
      }
    }
    result = await queryConnection(conn,
      'INSERT member(store_id, first_name, last_name, display_name, email, phone, social_id, address_id, status, refer_code, referred_by) VALUES (?);',
      [[storeId, member['first_name'], member['last_name'], member['display_name'], member['email'], member['phone'],
        socialId, addressId, 'Active', Math.random().toString(36).slice(2), referrer]]);
    await queryConnection(conn, 'UPDATE member SET password_hash = SHA2(CONCAT(?,id),224) WHERE id = ?;', [member['password'], result.insertId]);
    new_member_id = result.insertId;
    if (can_pick)
      await queryConnection(conn, 'INSERT box (member_id, product_id, special, month, year, price, tax_rate, shipped) VALUES (?,(SELECT id FROM product WHERE month = ? AND year = ? AND featured = 1 ORDER BY rand() LIMIT 1),1,?,?,0.00,0.00000,0);',
        [new_member_id, this_month, this_year, this_month, this_year]);
    if (plan_obj['groupon_code']) {
      plan = await getGrouponPlan(plan_obj['groupon_code']);
      renewal_plan = await getPromoPlan(storeId, plan['renews_into']) || {price: ''};
      await addPaymentMethod(plan_obj['nonce'], null, new_member_id);
      let count = await queryConnection(conn, 'UPDATE groupon SET redeemed = true, redeemed_by = ?, redeemed_date = CURRENT_TIMESTAMP WHERE groupon_code = ?;', [new_member_id, [plan_obj['groupon_code']]]);
      if (count.affectedRows !== 1) throw new Error('Unspecified error in gift redemption.');
      let tax_query = await getTaxRate(address['zip']);
      if (tax_query.length > 0) rate = tax_query[0]['rate'];

      await queryConnection(conn, 'UPDATE member SET source = "groupon" WHERE id = ?;', [new_member_id]);
      let result = await queryConnection(conn, 'INSERT order_history (label, member_id, date_created, status) VALUES (?,?,current_timestamp,\'Settled\')', ["groupon-redeem-" + plan_obj['groupon_code'], new_member_id]);
      await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES (?,?,\'Subscription\', ?, ?)', [result.insertId, plan['id'], 0.00, rate]);

      let [first_year, first_month] = addMonths(this_month, this_year, (can_pick ? 0 : 1));
      let [last_year, last_month] = addMonths(first_month, first_year, (plan['months'] - 1));
      let renewal_date = new Date();
      renewal_date.setFullYear(last_year + 2015);
      renewal_date.setMonth(last_month + 1);
      renewal_date.setDate(0);
      if (can_pick)
        await sendWelcomeOpenCycle(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, true, member['email']);
      else
        await sendWelcomeNonPicking(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, true, member['email']);
    }
    if (plan_obj['gift_code']) {
      plan = await getGiftPlan(plan_obj['gift_code']);
      renewal_plan = await getPromoPlan(storeId, plan['renews_into']) || {price: ''};
      let gifts = await queryConnection(conn, 'SELECT * FROM gift WHERE gift_code = ?', [plan_obj['gift_code']]), gift = gifts[0];
      let count = await queryConnection(conn, 'UPDATE gift SET redeemed = true, redeemed_by = ?, redeemed_date = CURRENT_TIMESTAMP WHERE gift_code = ?;', [new_member_id, [plan_obj['gift_code']]]);
      if (count.affectedRows !== 1) throw new Error('Unspecified error in gift redemption.');
      let tax_query = await getTaxRate(address['zip']);
      if (tax_query.length > 0) rate = tax_query[0]['rate'];
      let result = await queryConnection(conn, 'INSERT order_history (label, member_id, date_created, status) VALUES (?,?,current_timestamp,\'Settled\')', ["gift-redeem-" + plan_obj['gift_code'], new_member_id]);
      await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES (?,?,\'Subscription\', ?, ?)', [result.insertId, plan['id'], 0.00, rate]);
      let [first_year, first_month] = addMonths(this_month, this_year, (can_pick ? 0 : 1));
      let [last_year, last_month] = addMonths(first_month, first_year, (plan['months'] - 1));
      let renewal_date = new Date();
      renewal_date.setFullYear(last_year + 2015);
      renewal_date.setMonth(last_month + 1);
      renewal_date.setDate(0);
      renew = false;
      if (can_pick)
        await sendWelcomeOpenCycle(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, true, member['email']);
      else
        await sendWelcomeNonPicking(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, true, member['email']);
      /*
       let sqsObj = await buildGiftEnroll(gift['id'], gift['email'], member['first_name'], member['last_name']);
       console.log(JSON.stringify(sqsObj, null, 2));
       result = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) values (\'GIFTENROLL\',?, false)', [JSON.stringify(sqsObj, null, 2)]);
       try {
       let sqsResult = await exportGiftEnroll(sqsObj);
       await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
       } catch (e) {
       console.error('Failed to export enrollment: ' + e);
       await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
       }
       */
    } else if (plan_obj['id'] && plan_obj['nonce']) {
      plan = await getPromoPlan(storeId, plan_obj['id'], plan_obj['promo']);
      renewal_plan = await getPromoPlan(storeId, plan['renews_into']) || {price: ''};
      let result = await getTaxRate(address['zip']);
      if (result.length > 0) rate = result[0]['rate'];
      let token = await addPaymentMethod(plan_obj['nonce'], null, new_member_id);
      if (plan['price'] * (1 + rate) > 0)
        transaction = await authPurchase(null, token, plan['price'] * (1 + rate), plan["months"]);
      else  transaction = {id: null};
      let [first_year, first_month] = addMonths(this_month, this_year, (can_pick ? 0 : 1));
      let [last_year, last_month] = addMonths(first_month, first_year, (plan['months'] - 1));
      let renewal_date = new Date();
      renewal_date.setFullYear(last_year + 2015);
      renewal_date.setMonth(last_month + 1);
      renewal_date.setDate(0);
      if (can_pick)
        await sendWelcomeOpenCycle(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, false, member['email']);
      else
        await sendWelcomeNonPicking(member['first_name'], plan['name'], ship_date, renewal_plan['price'], renewal_date, false, member['email']);
      result = await queryConnection(conn, 'INSERT order_history (label, member_id, date_created, status) VALUES (?,?,current_timestamp,\'Settled\')', [transaction.id, new_member_id]);
      await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES (?,?,\'Subscription\', ?, ?)', [result.insertId, plan['id'], plan['price'], rate]);
      let sqsObj = await buildPlanPurchase(new_member_id, result.insertId, address, Date.now(), plan['mmid'], plan['price'], transaction.id);
      result = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) values (\'INVOICE\',?, false)', [JSON.stringify(sqsObj, null, 2)]);
      try {
        let sqsResult = await exportPlanPurchase(sqsObj);
        await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
      } catch (e) {
        console.error('Failed to export enrollment: ' + e);
        await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
      }
    }
    if (!plan) throw new Error('Failed to find plan in user creation.');
    let [first_year, first_month] = addMonths(this_month, this_year, (can_pick ? 0 : 1));
    let [last_year, last_month] = addMonths(first_month, first_year, (plan['months'] - 1));
    await queryConnection(conn, 'INSERT subscription (store_id, member_id, plan_id, first_month, first_year, last_month, ' +
      'last_year, months_skipped, price, tax_rate, will_renew, renewal_plan_id) values (?,?,?,?,?,?,?,?,?,?,?,?);',
      [1, new_member_id, plan['id'], first_month, first_year, last_month, last_year, 0, plan['price'], rate, renew, plan['renews_into']]);
    let sqsObj = await buildEnrollment({
      id: new_member_id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      enroll_date: Date.now(),
      address: address
    });
    let result = await queryConnection(conn, 'INSERT sqs_log (queue, object) values (\'ENROLL\',?)', [JSON.stringify(sqsObj, null, 2)]);
    try {
      let sqsResult = await exportEnrollment(sqsObj);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
    } catch (e) {
      console.error('Failed to export enrollment: ' + e);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
    }
    await commitTransaction(conn);
    return {newMemberId: new_member_id};
  } catch (e) {
    if (transaction && transaction.id) await cancelTransaction(transaction.id);
    if (conn) await rollback(conn);
    return {error: e, newMemberId: null};
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

export async function setPlan(store_id, member_id, email, can_pick, ship_date, plan_id, promo, nonce, token) {
  let conn = null, transaction = null;
  let this_month = (new Date()).getMonth(), this_year = (new Date()).getYear() - 115;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let plan = await getPromoPlan(store_id, plan_id, promo);
    let renewalPlan = await getPromoPlan(store_id, plan['renews_into']);
    if (!plan) throw new Error('Invalid plan ID.');
    let [address] = await queryConnection(conn,
      'SELECT a.name name, a.street1 street1, a.street2 street2, a.city city, a.state state, a.zip zip, m.first_name first_name FROM address a ' +
      'INNER JOIN member m ON m.address_id = a.id WHERE m.id = ?;', [member_id]);
    let [{rate}] = await queryConnection(conn,
      'SELECT IFNULL(rate,0.00) rate FROM address a ' +
      'INNER JOIN member m on m.address_id = a.id ' +
      'LEFT JOIN zip_tax zt on zt.zip5 = LEFT(a.zip,5) ' +
      'WHERE m.id = ?;', [member_id]);
    if (plan['price'] * (1 + rate) > 0)
      transaction = await authPurchase(nonce, token, plan['price'] * (1 + rate), plan["months"]);
    else  transaction = {id: null};
    let [first_year, first_month] = addMonths(this_month, this_year, (can_pick ? 0 : 1));
    let [last_year, last_month] = addMonths(first_month, first_year, (plan['months'] - 1));
    await queryConnection(conn, 'INSERT subscription (store_id, member_id, plan_id, first_month, first_year, last_month, ' +
      'last_year, months_skipped, price, tax_rate, will_renew, renewal_plan_id) values (1,?,?,?,?,?,?,1,?,?,true,?);',
      [member_id, plan_id, first_month, first_year, last_month, last_year, plan['price'], rate, plan['renews_into']]);
    let result = await queryConnection(conn, 'INSERT order_history (label, member_id, date_created, status) VALUES (?,?,current_timestamp,\'Settled\')', [transaction.id, member_id]);
    await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES (?,?,\'Subscription\', ?, ?)', [result.insertId, plan['id'], plan['price'], rate]);
    let sqsObj = await buildPlanPurchase(member_id, result.insertId, address, Date.now(), plan['mmid'], plan['price'], transaction.id);
    console.log(JSON.stringify(sqsObj, null, 2));
    result = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) values (\'INVOICE\',?, false)', [JSON.stringify(sqsObj, null, 2)]);
    try {
      let sqsResult = await exportPlanPurchase(sqsObj);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
    } catch (e) {
      console.error('Failed to export enrollment: ' + e);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
    }
    let renewal_date = new Date();
    renewal_date.setFullYear(last_year + 2015);
    renewal_date.setMonth(last_month + 1);
    renewal_date.setDate(0);
    if (can_pick)
      await sendWelcomeBack(address['first_name'], plan['name'], ship_date, renewalPlan['price'], renewal_date, email);
    await commitTransaction(conn);
  } catch (e) {
    console.error('Failed to set plan: ' + e);
    if (conn) await rollback(conn);
    if (transaction && transaction.id) await cancelTransaction(transaction.id);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

export async function changeRenewInto(store_id, member_id, plan_id) {
  let this_month = (new Date()).getMonth(), this_year = (new Date()).getYear() - 115,
    subscriptions = await readQuery(
      'SELECT plan_id, first_month, first_year, last_month, last_year, months_skipped, IFNULL(price,0) price, ' +
      'IFNULL(tax_rate,0) tax_rate, will_renew, renewal_plan_id ' +
      'FROM subscription WHERE member_id = ? ORDER BY last_year DESC, last_month DESC;', [member_id]);
  if (subscriptions[0] && subscriptions[0]['last_year'] >= this_year && subscriptions[0]['last_month'] >= this_month) {
    await writeQuery(
      'UPDATE subscription SET renewal_plan_id = ? ' +
      'WHERE store_id = ? AND member_id = ? AND plan_id = ? AND last_month = ? AND last_year = ?;',
      [plan_id, store_id, member_id, subscriptions[0]['plan_id'], subscriptions[0]['last_month'], subscriptions[0]['last_year']]);
    return true;
  } else {
    throw new Error('No current plan.');
  }
}

export async function addGiftToAccount(store_id, member_id, can_pick, gift_code) {
  let this_month = (new Date()).getMonth(), this_year = (new Date()).getYear() - 115, conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let subscriptions = await readQuery(
      'SELECT plan_id, first_month, first_year, last_month, last_year, months_skipped, IFNULL(price,0) price, ' +
      'IFNULL(tax_rate,0) tax_rate, will_renew, renewal_plan_id ' +
      'FROM subscription WHERE member_id = ? ORDER BY last_year DESC, last_month DESC;', [member_id]), subscription = subscriptions[0];
    let gifts = await queryConnection(conn, 'select plan_id, redeemed from gift where gift_code = ? ' +
      'and (redeemed = false or redeemed is null);', [gift_code]), gift = gifts[0];
    let members = await queryConnection(conn, 'SELECT * FROM member WHERE id = ?', [member_id]), member = members[0];
    if (!gift) throw new Error('Gift does not exist or has already been redeemed');
    let plans = await queryConnection(conn, 'SELECT * FROM plan WHERE id = ?', [gift['plan_id']]), plan = plans[0];
    let taxes = await queryConnection(conn,
      'SELECT rate FROM zip_tax WHERE zip5 = (SELECT LEFT(zip,5) FROM address WHERE id = ? LIMIT 1);', [member_id]),
      tax = taxes[0] || {rate: 0.00};
    if (subscription && subscription['last_year'] > this_year || (subscription && subscription['last_year'] == this_year && subscription['last_month'] >= this_month)) {
      let [new_year, new_month] = addMonths(subscription['last_month'], subscription['last_year'], plan['months'] + (can_pick ? 0 : 1));
      let result = await queryConnection(conn, 'UPDATE subscription SET last_month = ?, last_year = ? WHERE ' +
        'store_id = ? AND member_id = ? AND plan_id = ? AND last_month = ? AND last_year = ?;',
        [new_month, new_year, store_id, member_id, subscription['plan_id'], subscription['last_month'], subscription['last_year']]);
      if (result.affectedRows != 1) throw new Error('Failed to update current valid subscription.');
    } else { // add new subscription
      let [last_year, last_month] = addMonths(this_month, this_year, plan['months'] + (can_pick ? 0 : 1));
      let result = await queryConnection(conn, 'INSERT subscription ' +
        '(store_id, member_id, plan_id, first_month, first_year, last_month, last_year, months_skipped, price, tax_rate, ' +
        'will_renew,gift,renewal_plan_id) VALUES (?,?,?,?,?,?,?,0,0,?,false,true,?)',
        [store_id, member_id, plan['id'], this_month, this_year, last_month, last_year, tax['rate'], plan['renews_into']]);
      if (result.affectedRows != 1) throw new Error('Failed to update current valid subscription.');
    }
    let result = await queryConnection(conn, 'INSERT order_history (label, member_id, date_created, status) VALUES (?,?,current_timestamp,\'Settled\')', ["gift-redeem-" + gift_code, member_id]);
    await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES (?,?,\'Subscription\', ?, ?)', [result.insertId, plan['id'], 0.00, tax['rate']]);
    await queryConnection(conn, 'UPDATE gift SET redeemed = true, redeemed_by = ?, redeemed_date = CURRENT_TIMESTAMP where gift_code = ? ', [member_id, gift_code]);
    /*
     let sqsObj = await buildGiftRedeem(gift['id'], member['email'], member['first_name'], member['last_name']);
     console.log(JSON.stringify(sqsObj, null, 2));
     result = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) values (\'GIFTREDEEM\',?, false)', [JSON.stringify(sqsObj, null, 2)]);
     try {
     let sqsResult = await exportGiftRedeem(sqsObj);
     await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
     } catch (e) {
     console.error('Failed to export enrollment: ' + e);
     await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
     }
     */
    await commitTransaction(conn);
  } catch (e) {
    if (conn) await rollback(conn);
    throw e;
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

export async function getIdByEmail(email) {
  let result = await readQuery('SELECT id FROM member WHERE email = ?', [email]);
  return result.map(r=>r['id'])[0];
}

export async function saveLeadToDB(storeId, email, source) {
  await writeQuery('INSERT IGNORE lead (email, source, store_id) VALUES (?,?,?)', [email, source, storeId]);
}

export async function saveSuggestionToDB(storeId, member, suggestion) {
  await writeQuery('INSERT selection_suggestions (store_id, member_id, title ) VALUES (?,?,?)', [storeId, member, suggestion]);
}

export async function saveMagazineLeadToDB(storeId, email, source) {
  await writeQuery('INSERT IGNORE magazine_lead (email, source, store_id) VALUES (?,?,?)', [email, source, storeId]);
}

export async function resetPassword(storeId, email) {
  let member = await findMemberByEmailPassword(storeId, email);
  if (member) {
    let resetData = {
      id: member.id,
      first_name: member.first_name,
      token: Math.random().toString(36).slice(2)
    };
    await writeQuery('INSERT password_reset (member_id, token) VALUES (?,?) ' +
      'ON DUPLICATE KEY UPDATE token = VALUES(token), when_created = CURRENT_TIME;',
      [resetData.id, resetData.token]);
    return resetData;
  }
  return null;
}

export async function updateMemberAvatar(id) {
  await writeQuery('UPDATE member SET picture_url = ? WHERE id = ?', [`member${id}avatar.jpeg`, id]);
}
