import {
  readQuery,
  writeQuery,
  getWriteConn,
  beginTransaction,
  commitTransaction,
  queryConnection,
  rollback,
  releaseConnection,
  endCluster
} from "../svc/utils/db";
import {getDefaultPayment, authPurchase, cancelTransaction} from "../svc/utils/braintree";
import {buildBookPurchase, exportBookPurchase} from "../svc/utils/sqs";
import {sendShipConfirm} from "../svc/email/shipConfirmation";

// Run with: node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/sendOrders.js
// To update transaction_numbers, convert file to update commands and run:
// mysql -h  xavier-staging.c17ujtdunkub.us-east-1.rds.amazonaws.com -u root -puYhY2wrn8SRmYAvv < db.sql 
// > mysqldump --databases xavier --host xavier-prod-us-east-1b.c17ujtdunkub.us-east-1.rds.amazonaws.com -u client_read -pmF2UQ8vxxMKY5cWA > db.sql
// > mysql -h  xavier-staging.c17ujtdunkub.us-east-1.rds.amazonaws.com -u root -puYhY2wrn8SRmYAvv < db.sql

function report(description, total, count, start) {
  const progress = Math.floor(count * 40 / total),
    elapsed = Math.floor((Date.now() - start) / 1000),
    m = Math.floor(elapsed / 60),
    s = ('00' + Math.floor(elapsed % 60).toString()).substr(-2),
    spinner = ['|', '/', '-', '\\'];
  process.stdout.write(`${description}: ${spinner[(count / 10) % 4]} ${'█'.repeat(progress)}${'░'.repeat(40 - progress)} in ${m}:${s}.\r`);
}

async function prepareOrder(member_id, year, month) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [members, subscriptions, items, credits] = await Promise.all([
      queryConnection(conn,
        'select IFNULL(zt.rate,0.0000) tax_rate, a.name name, a.street1 street1, a.street2 street2, a.city city, a.state state, a.zip zip from member m ' +
        'inner join address a on m.address_id = a.id left join zip_tax zt on lpad(a.zip,5,\'0\') = zt.zip5 where m.id = ?;', [member_id]),
      queryConnection(conn,
        'select * from subscription where (last_year > ? OR (last_year = ? AND last_month >= ?)) and member_id = ? order by last_year desc, ' +
        'last_month desc limit 1;', [year, year, month, member_id]),
      queryConnection(conn,
        'select p.id id, p.mmid mmid, p.price price from box b inner join product p on b.product_id = p.id ' +
        'where b.shipped = 1 and b.year = ? and b.month = ? and b.member_id = ? order by b.special desc;', [year, month, member_id]),
      queryConnection(conn,
        'select sum(delta) count from credit_history where member_id = ?;', [member_id])
    ]);
    if (members.length === 0) throw new Error('Member: ' + member_id + ' not found.');
    let {tax_rate, name, street1, street2, city, state, zip} = members[0];
    if (subscriptions.length === 0) throw new Error('Member: ' + member_id + ' does not have a valid subscription.');
    let credit_count = credits[0] ? credits[0]['count'] : 0, credits_used = 0;
    let products = items.map((item, i)=> {
      let product = {
        product_id: item['id'],
        mmid: item['mmid']
      };
      if (i === 0) {
        product.price = 0.00;
        product.credit = 0;
      } else if (credit_count > 0) {
        product.price = 0.00;
        product.credit = 1;
        credit_count -= 1;
        credits_used += 1;
      } else {
        product.price = item['price'] || 9.99;
        product.credit = 0;
      }
      return product;
    });
    let product_ids = products.map(p=>p['product_id']).join(), product_mmids = products.map(p=>p['mmid']).join(),
      product_prices = products.map(p=>p['price']).join(), product_credits = products.map(p=>p['credit']).join(),
      subtotal = products.reduce((c, p)=>c + p['price'], 0), total = subtotal * (1 + tax_rate);
//    products.push({mmid: 1410926, price: 0});
    products = JSON.stringify(products.map(p=> {
      return {item_mmid: p['mmid'], item_rate: p['price']};
    }));
    await queryConnection(conn,
      'INSERT order_placement (member_id, store_id, month, year, products, product_ids, product_mmids, product_prices, product_credits, ' +
      'subtotal, tax_rate, total, credits, charge_attempts, is_sent, address_name, address_street1, address_street2, address_city, address_state, address_zip) ' +
      'VALUES (?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [member_id, month, year, products, product_ids, product_mmids, product_prices, product_credits, subtotal, tax_rate, total, credits_used,
        0, false, name, street1, street2, city, state, zip]);
    await commitTransaction(conn);
    await rollback(conn);
  } catch (e) {
    console.error('Error preparing order for: ' + member_id + ', e = ' + e);
    if (conn) await rollback(conn);
    console.error('Transaction rolled back for: ' + member_id);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

async function chargeMember(member_id, year, month, attempt) {
  let conn = null, transaction = null, succeeded = false, message = null;
  try {
    let token, last4, cardType;
    conn = await getWriteConn();
    await beginTransaction(conn);
    let orders = await queryConnection(conn, 'SELECT total, credits, product_ids, product_prices, tax_rate FROM order_placement WHERE ' +
      'member_id = ? AND year = ? AND month = ? AND is_charged = false and charge_attempts < ?', [member_id, year, month, attempt]);
    if (orders.length === 0) throw new Error('No orders available to be charged for member: ' + member_id);
    let {total, credits, product_ids, product_prices, tax_rate} = orders[0];
    if (credits > 0) await queryConnection(conn, 'INSERT credit_history (member_id, delta, source) VALUES (?,?,?);',
      [member_id, (-1 * credits), ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month] + ' box.']);
    if (total > 0) {
      let method = await getDefaultPayment(member_id);
      if (!method) throw new Error('No payment method found for member ' + member_id + '.');
      token = method.token;
      last4 = method.last4;
      cardType = method.cardType;
      transaction = await authPurchase(null, token, total, "Extra");
    }
    await queryConnection(conn, 'UPDATE order_placement SET charge_attempts = ?, last_four = ?, card_type = ?, transaction_id = ?, transaction = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?;', [attempt, last4, cardType, transaction ? transaction.id : null,
      transaction ? JSON.stringify(transaction, null, 2) : null, member_id, year, month]);
    let result = await queryConnection(conn, 'INSERT order_history (label, member_id, status, date_created) VALUES (?,?,\'Shipped\',NOW())',
      [transaction ? transaction.id : null, member_id]);
    let items = product_ids.split(',').map((p, i)=>[result.insertId, p, 'Book', product_prices.split(',')[i], tax_rate]);
    await queryConnection(conn, 'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) VALUES ?', [items]);
    await queryConnection(conn, 'UPDATE order_placement SET is_charged = 1, charge_attempts = ?, order_id = ? WHERE member_id = ? AND year = ? AND month = ?', [attempt, result.insertId, member_id, year, month]);
    await commitTransaction(conn);
    succeeded = true;
  } catch (e) {
    console.error('Failed to authorize order for: ' + member_id + ', error: ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      if (transaction) await cancelTransaction(transaction.id);
    } catch (e2) {
      console.error('Failed to clean up! ' + e2);
    }
  } finally {
    try {
      if (conn) await releaseConnection(conn);
      if (!succeeded) await writeQuery('UPDATE order_placement SET charge_attempts = ?, transaction_id = ? WHERE member_id = ? AND year = ? AND month = ?',
        [attempt, message, member_id, year, month]);
    } catch (e) {
      console.error('Failed to failure for member: ' + member_id + '.  Error: ' + message);
    }
  }
}

async function sendOrder(member_id, year, month) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [order] = await queryConnection(conn, 'SELECT member_id, order_id, transaction_id, card_type, last_four, products, ' +
      'address_name, address_street1, address_street2, address_state, address_city, address_zip FROM order_placement ' +
      'WHERE member_id = ? AND is_charged = 1 AND year = ? AND month = ?', [member_id, year, month]);
    if (!order) throw new Error('Order could not be found for member: ' + member_id);
    let sqsObj = buildBookPurchase(member_id, order['order_id'], order['transaction_id'], order['card_type'], order['last_four'], order['products'],
      order['address_name'], order['address_street1'], order['address_street2'], order['address_city'], order['address_state'], order['address_zip']);
    let sqsLogResult = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) VALUES (\'INVOICE\',?, false)', [JSON.stringify(sqsObj)]);
    let sqsResult = await exportBookPurchase(sqsObj); // sends purchase to NetSuite
    await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult), sqsLogResult.insertId]);
    await queryConnection(conn, 'UPDATE order_placement SET is_sent = 1 WHERE member_id = ? AND year = ? AND month = ?', [member_id, year, month]);
    await commitTransaction(conn);
  } catch (e) {
      console.error('Failed to push order to queue!');
    if (conn) await rollback(conn);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

async function sendShipConfirmation(member_id, year, month, day) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [order] = await queryConnection(conn,
      'select m.email email, m.first_name first_name, op.month month, op.subtotal subtotal, op.tax_rate tax_rate, op.total total, ' +
      'concat(\'BOTM\',op.order_id) order_id, op.tracking_number tracking_number, op.product_prices, op.product_credits, ' +
      'op.product_ids product_ids from order_placement op inner join member m on op.member_id = m.id ' +
      'where year = ? and month = ? and is_confirmed = 0 and member_id = ?;', [year, month, member_id]);
    if (!order) throw new Error('Member ' + member_id + ' could not be found!');
    let products = await queryConnection(conn, 'select id, img, title from product where id in ?;', [[order['product_ids'].split(',')]]);
    if (products.length < 1) throw new Error('Products could not be found for: ' + order['product_ids']);
    let prods = order['product_ids'].split(',').map((id, i)=>({
      id: id,
      price: order['product_prices'].split(',')[i],
      credits: parseInt(order['product_credits'].split(',')[i], 10),
      url: products.find(p=>p['id'] == id)['img'],
      title: products.find(p=>p['id'] == id)['title']
    })).map((p, i)=>({
      url: p['url'],
      title: p['title'],
      priceLabel: i === 0 ? 'Included in membership' : p['credits'] ? '1 credit' : p['price']
    }));
    await queryConnection(conn, 'UPDATE order_placement SET is_confirmed = 1 ' +
      'WHERE member_id = ? AND year = ? AND month = ?;', [member_id, year, month]);
    let boxProducts = order['product_ids'].split(',').map((id, i)=>({
      id: id,
      price: order['product_prices'].split(',')[i],
      credit: parseInt(order['product_credits'].split(',')[i], 10),
      tracking_number: order['tracking_number'],
      tax_rate: order['tax_rate']
    }));
    let boxUpdates = boxProducts.map(p=>queryConnection(conn, 'UPDATE box SET ' +
      'date_shipped = ?, tracking_number = ?, price = ?, credit = ?, tax_rate = ? WHERE ' +
      'member_id = ? AND year = ? AND month = ? AND product_id = ? LIMIT 1;', [
      (year + 2015) + '-' + ('0' + (month + 1)).substr(-2) + '-' + ('0' + day).substr(-2),
      p['tracking_number'], p['price'], p['credit'], p['tax_rate'], member_id, year, month, p['id']
    ]));
    await Promise.all(boxUpdates);
    await sendShipConfirm(order['first_name'], month, order['subtotal'], (order['subtotal'] * order['tax_rate']).toFixed(2), order['total'], order['order_id'], order['tracking_number'], prods, order['email']);
    await commitTransaction(conn);
  } catch (e) {
    console.error('Failed to send email confirmation to: ' + member_id + ', error: ' + e);
    if (conn) await rollback(conn);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

async function prepareOrders(year, month) {
  try {
    let memberIDs = await readQuery(
      'select distinct member_id from box where year = ? and month = ? and shipped = 1 and ' +
      'member_id in (select distinct member_id from subscription where (last_year > ? OR (last_year = ? and last_month >= ?))) and ' +
      'member_id not in (select distinct member_id from order_placement where year = ? and month = ?) and ' +
      'member_id not in (select id from member where test = 1);'
      /*      'select distinct member_id from box where year = ? and month = ? and shipped = 1 and ' +
       ' member_id in (select distinct member_id from subscription where (last_year > ? OR (last_year = ? and last_month >= ?))) and ' +
       ' member_id not in (select distinct member_id from order_placement where year = ? and month = ?) and ' +
       ' member_id not in (select id from member where test = 1) and ' +
       ' member_id in (select distinct member_id from subscription s inner join plan p on s.plan_id = p.id where p.months >= 3) and ' +
       ' member_id in (select id from member where enroll_date > \'2016-06-15\') and ' +
       ' member_id not in (select distinct redeemed_by from gift where redeemed_by is not null) and ' +
       ' member_id not in (select distinct member_id from order_placement);'*/
      , [year, month, year, year, month, year, month]);
    let orders = memberIDs.map(m=>prepareOrder(m['member_id'], year, month));
    let total = orders.length, start = Date.now();
    console.log('Processing ' + total + ' orders.');
    while (orders.length > 1) {
      await Promise.all(orders.splice(0, 10));
      report('Preparing Orders', total, total - orders.length, start);
    }
    if (orders.length === 1) await orders[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

async function chargeMembers(year, month, attempt) {
  try {
    let memberIDs = await readQuery('select distinct member_id id from order_placement where ' +
      'year = ? and month = ? and is_charged = 0 AND charge_attempts < ?;', [year, month, attempt]);
    let charges = memberIDs.map(m=>chargeMember(m['id'], year, month, attempt));
    let total = charges.length, start = Date.now();
    console.log('Charging ' + total + ' orders.');
    while (charges.length > 1) {
      await Promise.all(charges.splice(0, 10));
      report('Charging customers', total, total - charges.length, start);
    }
    if (charges.length === 1) await charges[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

async function sendOrders(year, month) {
  try {
    let memberIDs = await readQuery('select distinct member_id id from order_placement WHERE ' +
      'year = ? and month = ? and is_sent = 0 AND is_charged = 1;', [year, month]);
    let orders = memberIDs.map(m=>sendOrder(m['id'], year, month));
    let total = orders.length, start = Date.now();
    console.log('Sending ' + total + ' orders.');
    while (orders.length > 1) {
      await Promise.all(orders.splice(0, 10));
      report('Sending orders', total, total - orders.length, start);
    }
    if (orders.length === 1) await orders[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

async function sendShipConfirmations(year, month, day) {
  try {
    let memberIDs = await readQuery('select distinct member_id id from order_placement WHERE ' +
      'year = ? and month = ? and is_sent = 1 and is_confirmed = 0 ' +
      'and tracking_number is not null;', [year, month]);
    let confirmations = memberIDs.map(m=>sendShipConfirmation(m['id'], year, month, day));
    let total = confirmations.length, start = Date.now();
    console.log('Sending ' + total + ' confirmation emails.');
    while (confirmations.length > 1) {
      await Promise.all(confirmations.splice(0, 10));
      report('Sending ship confirmations', total, total - confirmations.length, start);
    }
    if (confirmations.length === 1) await confirmations[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}


// prepareOrders(1, 6);
// chargeMembers(1, 6, 1);
// sendOrders(1,6);
sendShipConfirmations(1, 6, 7);