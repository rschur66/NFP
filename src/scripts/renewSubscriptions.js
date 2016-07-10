/*
 Run off command line:
 node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/renewSubscriptions.js
 */
import {readQuery, writeQuery, endCluster} from '../svc/utils/db';
import {getDefaultPayment, authPurchase, cancelTransaction} from '../svc/utils/braintree';
import {sendRenewalSuccessEmail} from '../svc/email/subscriptionRenewalSuccess';
import {sendRenewalFailureEmail} from '../svc/email/subscriptionRenewalFailure';
import { buildPlanPurchase, exportPlanPurchase } from '../svc/utils/sqs';

export function addMonths(this_month, this_year, months) {
  let new_months = 12 * this_year + this_month + months;
  return [Math.floor(new_months / 12), new_months % 12];
}

async function renewUser(member_id) {
  let transaction = null, paymentMethod = null, last4 = null, cardType = null;
  let firstName = null, email = null, planName = null, planPrice = null, totalPrice = null;
  let planMmid = null, taxRate = null, name = null, street1 = null, street2 = null, city = null, state = null, zip = null;
  let this_month = 3, this_year = 1;
  try {
    let current_subscriptions = await readQuery(
        'SELECT member_id, first_name, email, IFNULL(zip_tax.rate,0) tax_rate, renewal_plan_id FROM subscription ' +
        'INNER JOIN member ON member.id = subscription.member_id ' +
        'LEFT JOIN address ON member.address_id = address.id ' +
        'LEFT JOIN zip_tax ON lpad(address.zip,5,\'0\') = zip_tax.zip5 ' +
        'WHERE last_month = 3 AND last_year = 1 AND member_id = ? AND will_renew = 1 ' +
        'AND member_id NOT IN (SELECT distinct member_id FROM subscription_renewal WHERE month = 3 AND year = 1) ' +
        'ORDER BY last_year DESC, last_month DESC LIMIT 1;', [member_id]),
      current_subscription = current_subscriptions[0];
    if (!current_subscription) throw new Error('No current renewing subscription found.');
    firstName = current_subscription['first_name'];
    email = current_subscription['email'];

    let plans = await readQuery(
      'SELECT id, name, mmid, months, price, renews_into FROM plan WHERE id = ?',
      [current_subscription['renewal_plan_id']]
      ),
      plan = plans[0];
    console.log('plans: ', plans);
    console.log('current_subscription: ', current_subscription);
    if (!plan) throw new Error('No plan found!');
    planName = plan['name'];
    planPrice = plan['price'];

    let [last_year, last_month] = addMonths(this_month, this_year, plan['months']);
    paymentMethod = await getDefaultPayment(member_id);
    last4 = paymentMethod.last4;
    cardType = paymentMethod.cardType;
    totalPrice = plan['price'] * (1 + current_subscription['tax_rate']);
    transaction = await authPurchase(null, paymentMethod.token, totalPrice, plan["months"]);
    // transaction = { id: 'lolcats', createdAt: '2016-05-01T02:51:54Z' }; // dummy braintree data
    await writeQuery(
      'INSERT subscription (store_id, member_id, plan_id, first_month, first_year, last_month, last_year, ' +
      'months_skipped, price, tax_rate, will_renew, renewal_plan_id) VALUES (1,?,?,?,?,?,?,0,?,?,1,?);',
      [member_id, plan['id'], this_month, this_year, last_month, last_year,
        planPrice, current_subscription['tax_rate'], plan['renews_into']]
    );
    await writeQuery(
      'INSERT subscription_renewal (member_id, store_id, month, year, ' +
      'braintree_transaction, is_resolved, plan_id, plan_renew_into, error_message, ' +
      'first_name, email, last_four, plan_name, plan_price, ' +
      'plan_mmid, tax_rate, name, street1, street2, city, state, zip) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [member_id, 1, this_month, this_year,
        JSON.stringify(transaction), 1, plan['id'], plan['renews_into'], null,
        firstName, email, last4, planName, planPrice,
        planMmid, taxRate, name, street1, street2, city, state, zip]
    ); // write success
  } catch (e) {
    console.log('Error: ', e);
    if (transaction) await cancelTransaction(transaction.id);
    await writeQuery(
      'INSERT subscription_renewal (member_id, store_id, month, year, ' +
      'braintree_transaction, is_resolved, has_failed, error_message, ' +
      'first_name, email, last_four, plan_name, plan_price, ' +
      'plan_mmid, tax_rate, name, street1, street2, city, state, zip) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [member_id, 1, this_month, this_year,
        JSON.stringify(transaction), 0, 1, e.toString(),
        firstName, email, last4, planName, planPrice,
        planMmid, taxRate, name, street1, street2, city, state, zip]
    ); // write failure
  }
}

async function addRenewalToOrderHistory(member_id, product_id, price, tax_rate) {
  let order_label = '';
  let orderHistory = await writeQuery(
    'INSERT order_history (label, member_id, date_created, status) ' +
    'VALUES (?, ?, CURRENT_TIMESTAMP, ?)',
    [order_label, member_id, 'Auth']
  );
  await writeQuery(
    'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate)' +
    'VALUES (?, ?, ?, ?, ?)',
    [orderHistory.insertId, product_id, 'Subscription', price, tax_rate]
  );
}

async function runRenewals() {
  try {
    let membersToRenew = await readQuery(
      "SELECT member_id FROM subscription " +
      "INNER JOIN member ON member.id = subscription.member_id " +
      "LEFT JOIN address ON member.address_id = address.id " +
      "LEFT JOIN zip_tax ON lpad(address.zip,5,'0') = zip_tax.zip5 " +
      "WHERE will_renew = 1 AND last_month = 3 AND last_year = 1 " +
      "AND member_id NOT IN (SELECT distinct member_id FROM subscription_renewal WHERE month = 3 AND year = 1) " +
      "AND member_id NOT IN (SELECT distinct member_id FROM subscription WHERE last_year*12+last_month > 15) " +
      "ORDER BY member_id ASC LIMIT 1;");
    await Promise.all(membersToRenew.map(m=>renewUser(m['member_id'])));
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}


async function sendRenewalSuccess(memberId) {
  try {
    let [{email, first_name, plan_name, plan_price, last_four, month}] =
      await readQuery('SELECT email, first_name, plan_name, plan_price, last_four, month FROM subscription_renewal WHERE ' +
        'month = 3 and year = 1 and is_resolved = true and (sent_email = false or sent_email is null) and member_id = ? LIMIT 1;', [memberId]);
    if (!email || !first_name || !plan_name || !plan_price || !last_four || !month)
      throw new Error('Issue with data: email: ' + email + ', first_name: ' + first_name + ', plan_name: ' + plan_name +
        ', plan_price: ' + plan_price + ', last_four: ' + last_four + ', month: ' + month);
    await sendRenewalSuccessEmail(email, first_name, plan_name, plan_price, last_four, month);
    await writeQuery('UPDATE subscription_renewal SET sent_email = true where member_id = ? AND month = 3 AND year = 1', [memberId]);
    console.log('Wrote to: ' + email + ', member id: ' + memberId);
  } catch (e) {
    console.error(e);
  }
}

async function sendSuccessEmails() {
  try {
    // Run at most 100 at a time.
    let membersToMail = await readQuery('SELECT member_id FROM subscription_renewal WHERE ' +
      'month = 3 and year = 1 and is_resolved = true and ' +
      'has_failed = false and (sent_email = false or sent_email is null) LIMIT 10;');
    await Promise.all(membersToMail.map(m=>sendRenewalSuccess(m['member_id'])));
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

async function sendRenewalFailures(memberId) {
  try {
    let [{email, first_name, plan_name, plan_price, last_four, month}] =
      await readQuery('SELECT email, first_name, plan_name, plan_price, last_four, month FROM subscription_renewal WHERE ' +
        'month = 3 and year = 1 and has_failed = true and is_resolved = false and (sent_email = false or sent_email is null) ' +
        'and member_id = ? LIMIT 1;', [memberId]);
    if (!email || !first_name || !plan_name || !plan_price || !last_four || !month)
      throw new Error('Issue with data: email: ' + email + ', first_name: ' + first_name + ', plan_name: ' + plan_name +
        ', plan_price: ' + plan_price + ', last_four: ' + last_four + ', month: ' + month);
    await sendRenewalFailureEmail(email, first_name, plan_name, plan_price, last_four, month);
    await writeQuery('UPDATE subscription_renewal SET sent_email = true where member_id = ? AND month = 3 AND year = 1', [memberId]);
    console.log('Wrote to: ' + email + ', member id: ' + memberId);
  } catch (e) {
    console.error(e);
  }
}

async function sendFailureEmail() {
  try {
    let membersToMail = await readQuery('SELECT member_id FROM subscription_renewal WHERE ' +
      'month = 3 and year = 1 and is_resolved = false and ' +
      'has_failed = true and (sent_email = false or sent_email is null) LIMIT 50;');
    await Promise.all(membersToMail.map(m=>sendRenewalFailures(m['member_id'])));
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

async function sendOrderToNetsuite(member) {
  try {
    let memberId = member.member_id,
        orderHistoryId = member.order_history_id,
        newPlanId = member.plan_id,
        newPlanPrice = member.plan_price,
        newPlanMmid = member.plan_mmid,
        taxRate = member.tax_rate,
        memberAddress = {
          name: member.name,
          street1: member.street1,
          street2: member.street2,
          city: member.city,
          state: member.state,
          zip: member.zip
        },
        transaction = JSON.parse(member.braintree_transaction),
        transactionId = (transaction.id) ? transaction.id : transaction,
        transactionDate = (transaction.createdAt) ? transaction.createdAt : Date.now();
    let sqsObj = await buildPlanPurchase(memberId, orderHistoryId, memberAddress, transactionDate, newPlanMmid, newPlanPrice, transactionId);
    let sqsLogResult = await writeQuery('INSERT sqs_log (queue, object, sent) VALUES (\'INVOICE\',?, false)', [JSON.stringify(sqsObj)]);
    let sqsResult = await exportPlanPurchase(sqsObj); // sends purchase to NetSuite
    // let sqsResult = { 'message': 'success!' }; // for testing, set to a placeholder object

    await writeQuery('UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult), sqsLogResult.insertId]);
    await writeQuery('UPDATE subscription_renewal SET sent_to_sqs = true WHERE month = 3 AND year = 1 AND member_id = ?;', [memberId]);
    console.log('Export success for member ' + memberId);
  } catch (e) {
    console.error(e);
    if (memberId) console.log('Failure exporting for member ' + memberId);
  }
}

async function sendOrdersToNetsuite() {
  try {
    // let membersToSendToSqsQuery = require('mysql').format(
    //     "SELECT member_id, IFNULL(zip_tax.rate,0) tax_rate, plan_id, plan_mmid, plan_price, address, order_history_id " +
    //     "FROM subscription_renewal " +
    //     "WHERE month = 3 AND year = 1 AND is_resolved = 1 AND sent_to_sqs = 0 " +
    //     "ORDER BY member_id ASC LIMIT 1;");
    // let membersToSendToSqs = await readQuery(membersToSendToSqsQuery);

    // Use this query while subscription_renewal isn't populated w/ address or tax data:
    let membersToSendToSqs = await readQuery(
        'SELECT member_id, plan_id, plan_price, braintree_transaction, ' +
        'order_history_id, ' +
        'plan.mmid AS plan_mmid, IFNULL(zip_tax.rate,0.00) AS tax_rate, ' +
        'address.name AS name, address.street1 AS street1, address.street2 AS street2, address.city AS city, address.state AS state, address.zip AS zip ' +
        'FROM subscription_renewal ' +
        'INNER JOIN member ON member.id = subscription_renewal.member_id ' +
        'INNER JOIN plan ON subscription_renewal.plan_id = plan.id ' +
        'INNER JOIN address ON member.address_id = address.id ' +
        'LEFT JOIN zip_tax ON lpad(address.zip,5,\'0\') = zip_tax.zip5 ' +
        'WHERE subscription_renewal.store_id = 1 AND month = 3 AND year = 1 ' +
        'AND is_resolved = 1 AND sent_to_sqs = 0 ' +
        'AND order_history_id IS NOT NULL ' +
        'ORDER BY member_id ASC LIMIT 1;');
    if (!membersToSendToSqs) throw new Error('No members found.');
    await Promise.all(membersToSendToSqs.map(m => {
      // m.order_history_id = 0; // dummy order history id until order_history is set up
      console.log('Sending member ' + m.member_id + ' to Netsuite.');
      sendOrderToNetsuite(m);
    }));
  } catch (e) {
    console.error(e);
  }
}

async function retryFailedUser(memberId) {
  let this_month = 3, this_year = 1;
  let transaction = null, paymentMethod = null, last4 = null, cardType = null;
  let plan = null, totalPrice = null;
  try {
    let members = await readQuery(
      "SELECT plan_id, plan_price, tax_rate, plan_renew_into FROM subscription_renewal " +
      "WHERE month = ? AND year = ? AND member_id = ?;",
      [this_month, this_year, memberId]
    );
    let member = members[0];
    if (!member) throw new Error('Member ' + memberId + ' not found.');

    let plans = await readQuery(
      'SELECT id, name, mmid, months, price, renews_into FROM plan WHERE id = ?;',
      [member.plan_id]
    );
    plan = plans[0];

    let [last_year, last_month] = addMonths(this_month, this_year, plan.months);
    paymentMethod = await getDefaultPayment(memberId);
    last4 = paymentMethod.last4;
    cardType = paymentMethod.cardType;
    totalPrice = member.plan_price * (1 + member.tax_rate);
    transaction = await authPurchase(null, paymentMethod.token, totalPrice, plan.months);
    // transaction = { id: 'lolcats', createdAt: '2016-05-01T02:51:54Z' }; // dummy braintree data

    await writeQuery(
      'INSERT subscription (store_id, member_id, plan_id, first_month, first_year, last_month, last_year, ' +
      'months_skipped, price, tax_rate, will_renew, renewal_plan_id) VALUES (1,?,?,?,?,?,?,0,?,?,1,?);',
      [memberId, member.plan_id, this_month, this_year, last_month, last_year,
        member.plan_price, member.tax_rate, member.plan_renew_into]
    );
    await writeQuery(
      "UPDATE subscription_renewal " +
      "SET is_resolved = 1, braintree_transaction = ?, last_four = ? " +
      "WHERE month = ? AND year = ? AND member_id = ?;",
      [JSON.stringify(transaction), last4,
      this_month, this_year, memberId]
    );
    console.log('Successfully renewed previously failed user ' + memberId);
  } catch (e) {
    console.log('Error retrying failed user: ', e);
    if (transaction) await cancelTransaction(transaction.id);
    if (memberId) console.log('Member ID ' + memberId);
    await writeQuery(
      "UPDATE subscription_renewal " +
      "SET has_failed = has_failed + 1, error_message = ? " +
      "WHERE month = ? AND year = ? AND is_resolved = 0 AND member_id = ?;",
      [e.toString(), this_month, this_year, memberId]
    );
  }
}

async function retryFailedRenewals() {
  try {
    let membersToRenew = await readQuery(
      "SELECT member_id FROM subscription_renewal " +
      "WHERE month = 3 AND year = 1 AND is_resolved = 0 AND has_failed = 1 " +
      "ORDER BY member_id ASC LIMIT 1;");
    await Promise.all(membersToRenew.map(m=>retryFailedUser(m.member_id)));
  } catch (e) {
    console.error(e);
  }
}
