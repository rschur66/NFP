/*
 Run off command line:
 node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 src/scripts/renewSubscriptions2.js
 */
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
import {sendRenewalSuccessEmail} from "../svc/email/subscriptionRenewalSuccess";
import {sendRenewalFailureEmail} from "../svc/email/subscriptionRenewalFailure";
import {sendRenewalRetrySuccessEmail} from "../svc/email/subscriptionRenewalRetrySuccess";
import {sendRenewalRetryFailureEmail} from "../svc/email/subscriptionRenewalRetryFailure";
import {buildPlanPurchase, exportPlanPurchase} from "../svc/utils/sqs";

/* Utility Functions */

function addMonths(this_month, this_year, months) {
  let new_months = 12 * this_year + this_month + months;
  return [Math.floor(new_months / 12), new_months % 12];
}

/* Individual Operations */

async function prepareRenewal(member_id, year, month) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let current_subscriptions = await queryConnection(conn,
      'SELECT member_id, first_name, email, IFNULL(zip_tax.rate,0) tax_rate, renewal_plan_id, ' +
      'address.* ' +
      'FROM subscription ' +
      'INNER JOIN member ON member.id = subscription.member_id ' +
      'LEFT JOIN address ON member.address_id = address.id ' +
      'LEFT JOIN zip_tax ON lpad(address.zip,5,\'0\') = zip_tax.zip5 ' +
      'WHERE last_month = ? AND last_year = ? AND member_id = ? AND will_renew = 1 ' +
      'AND member_id NOT IN (SELECT DISTINCT member_id FROM subscription WHERE last_year > ? OR (last_year = ? and last_month > ?)) ' +
      'AND member_id NOT IN (SELECT distinct member_id FROM subscription_renewal WHERE month = ? AND year = ?) ' +
      'ORDER BY last_year DESC, last_month DESC LIMIT 1;',
      [month, year, member_id, year, year, month, month, year]
    );
    let current_subscription = current_subscriptions[0];
    if (!current_subscription) throw new Error('No current renewing subscription found for member ' + member_id + '.');
    let {first_name, email, name, street1, street2, city, state, zip, tax_rate} = current_subscription;

    let plans = await queryConnection(conn,
      'SELECT id AS plan_id, name AS plan_name, mmid AS plan_mmid, ' +
      'months AS plan_months, price AS plan_price, renews_into AS plan_renew_into ' +
      'FROM plan WHERE id = ?',
      [current_subscription['renewal_plan_id']]
    );
    let plan = plans[0];
    if (!plan) throw new Error('No plan found for member ' + member_id + '.');
    let {plan_id, plan_name, plan_mmid, plan_months, plan_price, plan_renew_into} = plan;

    let writeQ = require('mysql').format(
      'INSERT subscription_renewal (member_id, store_id, month, year, ' +
      'braintree_transaction, is_resolved, has_failed, error_message, ' +
      'first_name, email, last_four, plan_id, plan_renew_into, plan_name, plan_price, plan_months, ' +
      'plan_mmid, tax_rate, name, street1, street2, city, state, zip) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
      [member_id, 1, month, year,
        null, 0, 0, null,
        first_name, email, null, plan_id, plan_renew_into, plan_name, plan_price, plan_months,
        plan_mmid, tax_rate, name, street1, street2, city, state, zip]
    );
    await queryConnection(conn, writeQ);
    await commitTransaction(conn);
    console.log('Renewal prepared for member ' + member_id);
  } catch (e) {
    console.error('Error preparing renewal for: ' + member_id + ', e = ' + e);
    if (conn) await rollback(conn);
    console.error('Transaction rolled back for: ' + member_id);
  } finally {
    if (conn) await releaseConnection(conn);
  }
}

async function updateRenewal(member_id, year, month, attempt) {
  let conn = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let current_subscriptions = await queryConnection(conn,
      'SELECT member_id, first_name, email, IFNULL(zip_tax.rate,0) tax_rate, renewal_plan_id, ' +
      'address.* ' +
      'FROM subscription ' +
      'INNER JOIN member ON member.id = subscription.member_id ' +
      'LEFT JOIN address ON member.address_id = address.id ' +
      'LEFT JOIN zip_tax ON lpad(address.zip,5,\'0\') = zip_tax.zip5 ' +
      'WHERE last_month = ? AND last_year = ? AND member_id = ? AND will_renew = 1 ' +
      'AND member_id NOT IN (SELECT DISTINCT member_id FROM subscription WHERE last_year > ? OR (last_year = ? and last_month > ?)) ' +
      'ORDER BY last_year DESC, last_month DESC LIMIT 1;',
      [month, year, member_id, year, year, month]
    );
    let current_subscription = current_subscriptions[0];
    let writeQ = '';
    if (!current_subscription) {
      console.log('Member ' + member_id + ' no longer has a subscription to renew for this month.');
      writeQ = require('mysql').format(
        'UPDATE subscription_renewal ' +
        'SET is_resolved = 0, has_failed = 0, error_message = "SUBSCRIPTION: CURRENT EXISTS OR RENEW IS MISSING" ' +
        'WHERE member_id = ? AND year = ? AND month = ?;',
        [member_id, year, month]
      );
    } else {
      let {first_name, email, name, street1, street2, city, state, zip, tax_rate} = current_subscription;
      let plans = await queryConnection(conn,
        'SELECT id AS plan_id, name AS plan_name, mmid AS plan_mmid, ' +
        'months AS plan_months, price AS plan_price, renews_into AS plan_renew_into ' +
        'FROM plan WHERE id = ?',
        [current_subscription['renewal_plan_id']]
      );
      let plan = plans[0];
      if (!plan) throw new Error('No plan found for member ' + member_id + '.');
      let {plan_id, plan_name, plan_mmid, plan_months, plan_price, plan_renew_into} = plan;

      writeQ = require('mysql').format(
        'UPDATE subscription_renewal SET is_resolved = ?, ' +
        'first_name = ?, email = ?, last_four = ?, ' +
        'plan_id = ?, plan_renew_into = ?, plan_name = ?, plan_price = ?, plan_months = ?, plan_mmid = ?, ' +
        'tax_rate = ?, name = ?, street1 = ?, street2 = ?, city = ?, state = ?, zip = ? ' +
        'WHERE member_id = ? AND year = ? AND month = ?;',
        [0, first_name, email, null,
          plan_id, plan_renew_into, plan_name, plan_price, plan_months, plan_mmid,
          tax_rate, name, street1, street2, city, state, zip,
        member_id, year, month]
      );
    }
    await queryConnection(conn, writeQ);
    await commitTransaction(conn);
    console.log('Renewal updated for member ' + member_id);
  } catch (e) {
    console.error('Error updating renewal for: ' + member_id + ', e = ' + e);
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
    let renewalsQ = require('mysql').format(
      'SELECT plan_price, plan_id, plan_mmid, tax_rate FROM subscription_renewal ' +
      'WHERE member_id = ? AND year = ? AND month = ? AND is_resolved = false AND has_failed = ?;',
      [member_id, year, month, attempt]
    );
    let renewals = await queryConnection(conn, renewalsQ);
    if (renewals.length === 0) throw new Error('No renewals to be charged for member: ' + member_id);
    let {plan_price, plan_id, tax_rate} = renewals[0];

    if (plan_price > 0) {
      let total = plan_price * (1 + tax_rate);
      let method = await getDefaultPayment(member_id);
      // let method = { token: 'bbbbbb', last4: '1111', cardType: 'Idek' }; // dummy braintree payment data
      if (!method) throw new Error('No payment method found for member ' + member_id + '.');
      token = method.token;
      last4 = method.last4;
      transaction = await authPurchase(null, token, total);
      // transaction = { id: 'lolcats', createdAt: '2016-05-31T02:51:54Z' }; // dummy braintree auth data
    }

    await queryConnection(conn,
      'UPDATE subscription_renewal ' +
      'SET is_resolved = 1, braintree_transaction = ?, last_four = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?;',
      [JSON.stringify(transaction), last4,
        member_id, year, month]
    );

    let result = await queryConnection(conn,
      'INSERT order_history (label, member_id, status, date_created) VALUES (?,?,\'Charged\',NOW())',
      [(transaction ? transaction.id : null), member_id]
    );
    await queryConnection(conn,
      'INSERT order_history_item (order_history_id, product_id, type, price, tax_rate) ' +
      'VALUES (?,?,?,?,?);',
      [result.insertId, plan_id, `Subscription`, plan_price, tax_rate]
    );

    await queryConnection(conn,
      'UPDATE subscription_renewal ' +
      'SET is_resolved = 1, order_history_id = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?;',
      [result.insertId, member_id, year, month]
    );
    await commitTransaction(conn);
    succeeded = true;
    console.log('Renewal charge resolved for member ' + member_id);
  } catch (e) {
    console.error('Failed to authorize charge for member ' + member_id + ' - ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      if (transaction) await cancelTransaction(transaction.id);
    } catch (e2) {
      console.error('Failed to clean up charge authorization failure for member '+ member_id + '! ' + e2);
    }
  } finally {
    if (conn) await releaseConnection(conn);
    if (!succeeded) await writeQuery(
      'UPDATE subscription_renewal SET has_failed = has_failed + 1, error_message = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?',
      [message, member_id, year, month]
    );
  }
}

async function addSubscription(member_id, year, month, attempt) {
  let conn = null, succeeded = false, message = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let renewalsQ = require('mysql').format(
      'SELECT store_id, plan_price, plan_id, plan_mmid, tax_rate, plan_renew_into FROM subscription_renewal ' +
      'WHERE member_id = ? AND year = ? AND month = ? AND is_resolved = 1 AND subscription_added = 0 AND has_failed = ?;',
      [member_id, year, month, attempt]
    );
    let renewals = await queryConnection(conn, renewalsQ);
    if (renewals.length === 0) throw new Error('No subscriptions to be added for member: ' + member_id);
    let {store_id, plan_price, plan_id, tax_rate, plan_renew_into} = renewals[0];

    let plans = await queryConnection(conn, 'SELECT months FROM plan WHERE id = ?;', plan_id);
    if (plans.length === 0) throw new Error('No subscription plan for member: ' + member_id);
    let {months} = plans[0];
    let [first_year, first_month] = addMonths(month, year, 1); // New subscriptions start on following month
    let [last_year, last_month] = addMonths(month, year, months);

    await queryConnection(conn,
      'INSERT subscription (store_id, member_id, plan_id, first_month, first_year, last_month, last_year, ' +
      'months_skipped, price, tax_rate, will_renew, renewal_plan_id) ' +
      'VALUES (?,?,?,?,?,?,?,0,?,?,1,?);',
      [store_id, member_id, plan_id, first_month, first_year, last_month, last_year,
        plan_price, tax_rate, plan_renew_into]
    );

    await queryConnection(conn,
      'UPDATE subscription_renewal ' +
      'SET subscription_added = 1 ' +
      'WHERE member_id = ? AND year = ? AND month = ?;',
      [member_id, year, month]
    );
    await commitTransaction(conn);
    succeeded = true;
    console.log('Subscription added for member ' + member_id);
  } catch (e) {
    console.error('Error adding subscription for member ' + member_id + ', e = ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      console.error('Transaction rolled back for member ' + member_id);
    } catch (e2) {
      console.error('Failed to clean up subscription add failure for member '+ member_id + '! ' + e2);
    }
  } finally {
    if (conn) await releaseConnection(conn);
    if (!succeeded) await writeQuery(
      'UPDATE subscription_renewal SET error_message = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?',
      [message, member_id, year, month]
    );
  }
}

async function sendOrder(member_id, year, month) {
  let conn = null, succeeded = false, message = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [order] = await queryConnection(conn,
      'SELECT member_id, plan_mmid, plan_price, tax_rate, ' +
      'order_history_id, braintree_transaction, last_four, ' +
      'name, street1, street2, state, city, zip FROM subscription_renewal ' +
      'WHERE is_resolved = 1 AND subscription_added = 1 AND sent_to_sqs = 0 ' +
      'AND member_id = ? AND year = ? AND month = ?',
      [member_id, year, month]
    );
    if (!order) throw new Error('Order could not be found for member: ' + member_id);

    let {plan_mmid, plan_price, tax_rate, order_history_id, braintree_transaction, last_four} = order;
    let memberAddress = {
      name: order.name,
      street1: order.street1,
      street2: order.street2,
      city: order.city,
      state: order.state,
      zip: order.zip
    },
    transaction = JSON.parse(braintree_transaction),
    transactionId = (transaction.id) ? transaction.id : transaction,
    transactionDate = (transaction.createdAt) ? transaction.createdAt : Date.now();

    let sqsObj = await buildPlanPurchase(
      member_id, order_history_id, memberAddress, transactionDate, plan_mmid, plan_price, transactionId
    );

    let sqsLogResult = await queryConnection(conn,
      'INSERT sqs_log (queue, object, sent) VALUES (\'INVOICE\',?, false)',
      [JSON.stringify(sqsObj)]
    );
    let sqsResult = await exportPlanPurchase(sqsObj); // sends purchase to NetSuite
    // let sqsResult = { 'object': sqsObj, 'message': 'success!' }; // for testing, set result to a placeholder object

    await queryConnection(conn,
      'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?',
      [JSON.stringify(sqsResult), sqsLogResult.insertId]
    );
    await queryConnection(conn,
      'UPDATE subscription_renewal SET sent_to_sqs = 1 WHERE member_id = ? AND year = ? AND month = ?',
      [member_id, year, month]
    );
    await commitTransaction(conn);
    succeeded = true;
    console.log('Order sent for: ' + member_id);
  } catch (e) {
    console.error('Error sending to NetSuite for member ' + member_id + ', ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      console.error('Transaction rolled back for member ' + member_id);
    } catch (e2) {
      console.error('Failed to clean up NetSuite send failure for member '+ member_id + '! ' + e2);
    }
  } finally {
    if (conn) await releaseConnection(conn);
    if (!succeeded) await writeQuery(
      'UPDATE subscription_renewal SET error_message = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?',
      [message, member_id, year, month]
    );
  }
}

async function sendSuccessEmail(member_id, year, month, pickLastDay = null) {
  let conn = null, succeeded = false, message = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [renewal] = await queryConnection(conn,
      'SELECT email, first_name, plan_name, plan_price, last_four, plan_months FROM subscription_renewal WHERE ' +
      'year = ? AND month = ? AND is_resolved = true AND (sent_email = false OR sent_email IS NULL) AND member_id = ? LIMIT 1;',
      [year, month, member_id]
    );
    if (!renewal) throw new Error('Subscription renewal success could not be found for member ' + member_id);

    let {email, first_name, plan_name, plan_price, last_four} = renewal;
    if (!email || !first_name || !plan_name || !plan_price || !last_four) {
      throw new Error(
        'Issue with data: email: ' + email + ', first_name: ' + first_name + ', plan_name: ' + plan_name +
        ', plan_price: ' + plan_price + ', last_four: ' + last_four
      );
    }

    await queryConnection(conn,
      'UPDATE subscription_renewal SET sent_email = 1 WHERE member_id = ? AND month = ? AND year = ?',
      [member_id, month, year]
    );
    if (pickLastDay) {
      await sendRenewalRetrySuccessEmail(email, first_name, plan_name, plan_price, last_four, month, pickLastDay);
    } else {
      await sendRenewalSuccessEmail(email, first_name, plan_name, plan_price, last_four, month);
    }
    await commitTransaction(conn);
    succeeded = true;

    if (pickLastDay) {
      console.log('Renewal retry success email sent to ' + email + '/member ' + member_id);
    } else {
      console.log('Renewal success email sent to ' + email + '/member ' + member_id);
    }
  } catch (e) {
    console.error('Failed to send renewal success email to member ' + member_id + ' - ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      console.error('Transaction rolled back for member ' + member_id);
    } catch (e2) {
      console.error('Failed to clean up success email send failure for member '+ member_id + '! ' + e2);
    }
  } finally {
    if (conn) await releaseConnection(conn);
    if (!succeeded) await writeQuery(
      'UPDATE subscription_renewal SET error_message = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?',
      [message, member_id, year, month]
    );
  }
}

async function sendFailureEmail(member_id, year, month, attempt, retry = false) {
  let conn = null, succeeded = false, message = null;
  try {
    conn = await getWriteConn();
    await beginTransaction(conn);
    let [renewal] = await queryConnection(conn,
      'SELECT email, first_name, plan_name, plan_price FROM subscription_renewal WHERE ' +
      'year = ? AND month = ? AND is_resolved = false AND has_failed = ? AND member_id = ? LIMIT 1;',
      [year, month, attempt, member_id]
    );
    if (!renewal) throw new Error('Subscription renewal failure could not be found for member ' + member_id);

    let {email, first_name, plan_name, plan_price} = renewal;
    if (!email || !first_name || !plan_name || !plan_price) {
      throw new Error(
        'Issue with data: email: ' + email + ', first_name: ' + first_name + ', plan_name: ' + plan_name +
        ', plan_price: ' + plan_price
      );
    }

    if (retry) {
      await sendRenewalRetryFailureEmail(email, first_name, month);
    } else {
      await sendRenewalFailureEmail(email, first_name, month);
    }
    await commitTransaction(conn);
    succeeded = true;

    if (retry) {
      console.log('Renewal retry failure email sent to ' + email + '/member ' + member_id);
    } else {
      console.log('Renewal failure email sent to ' + email + '/member ' + member_id);
    }
  } catch (e) {
    console.error('Failed to send renewal failure email to member ' + member_id + ' - ' + e);
    message = e.toString();
    try {
      if (conn) await rollback(conn);
      console.error('Transaction rolled back for member ' + member_id);
    } catch (e2) {
      console.error('Failed to clean up failure email send fail for member '+ member_id + '! ' + e2);
    }
  } finally {
    if (conn) await releaseConnection(conn);
    if (!succeeded) await writeQuery(
      'UPDATE subscription_renewal SET error_message = ? ' +
      'WHERE member_id = ? AND year = ? AND month = ?',
      [message, member_id, year, month]
    );
  }
}

/* Main Operations */

// Create subscription renewal logs in DB
async function prepareRenewals(year, month) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription " +
      "INNER JOIN member ON member.id = subscription.member_id " +
      "LEFT JOIN address ON member.address_id = address.id " +
      "LEFT JOIN zip_tax ON lpad(address.zip,5,'0') = zip_tax.zip5 " +
      "WHERE will_renew = 1 AND last_month = ? AND last_year = ? " +
      "AND member_id NOT IN (SELECT DISTINCT member_id FROM subscription WHERE last_year > ? OR (last_year = ? and last_month > ?))" +
      "AND member_id NOT IN (SELECT DISTINCT member_id FROM subscription_renewal WHERE month = ? AND year = ?) " +
      "AND (member.test = 0 OR member.test IS NULL) " +
      "ORDER BY member_id ASC LIMIT 1000;", [month, year, year, year, month, month, year]
    );
    if (memberIDs.length === 0) throw new Error('No members to prepare renewals for.');
    console.log('Preparing renewals for ' + memberIDs.length + ' members.');
    let renewals = memberIDs.map(m=>prepareRenewal(m['member_id'], year, month));
    while (renewals.length > 1) await Promise.all(renewals.splice(0, 10));
    if (renewals.length === 1) await renewals[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Update subscription renewal logs in DB for previously failed members (before next renewal attempt)
async function updateRenewals(year, month, attempt) {
  try {
    let memberIDs = await readQuery(
      'SELECT DISTINCT member_id FROM subscription_renewal ' +
      'WHERE month = ? AND year = ? AND is_resolved = 0 AND has_failed = ? ' +
      'ORDER BY member_id ASC LIMIT 1000;', [month, year, attempt]
    );
    if (memberIDs.length === 0) throw new Error('No members to update renewals for.');
    console.log('Updating renewals for ' + memberIDs.length + ' members.');
    let renewals = memberIDs.map(m=>updateRenewal(m['member_id'], year, month, attempt));
    while (renewals.length > 1) await Promise.all(renewals.splice(0, 10));
    if (renewals.length === 1) await renewals[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Charge members in Braintree and add to order history
async function chargeMembers(year, month, attempt) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription_renewal WHERE " +
      "year = ? AND month = ? AND is_resolved = 0 AND has_failed = ? " +
      "ORDER BY member_id ASC LIMIT 1000;",
      [year, month, attempt]
    );
    if (memberIDs.length === 0) throw new Error('No members to charge.');
    console.log('Attempting to charge ' + memberIDs.length + ' members in Braintree.');
    let charges = memberIDs.map(m=>chargeMember(m['member_id'], year, month, attempt));
    while (charges.length > 1) await Promise.all(charges.splice(0, 10));
    if (charges.length === 1) await charges[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Add subscriptions in DB
async function addSubscriptions(year, month, attempt) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription_renewal WHERE " +
      "year = ? AND month = ? AND is_resolved = 1 AND subscription_added = 0 AND has_failed = ? " +
      "ORDER BY member_id ASC LIMIT 1000;",
      [year, month, attempt]
    );
    if (memberIDs.length === 0) throw new Error('No members to add subscriptions for.');
    console.log('Adding new subscriptions for ' + memberIDs.length + ' members.');
    let subscriptions = memberIDs.map(m=>addSubscription(m['member_id'], year, month, attempt));
    while (subscriptions.length > 1) await Promise.all(subscriptions.splice(0, 10));
    if (subscriptions.length === 1) await subscriptions[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Send orders to NetSuite
async function sendOrders(year, month) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription_renewal WHERE " +
      "year = ? AND month = ? AND is_resolved = 1 AND subscription_added = 1 AND sent_to_sqs = 0 " +
      "ORDER BY member_id ASC LIMIT 1000;",
      [year, month]
    );
    if (memberIDs.length === 0) throw new Error('No orders to send to NetSuite.');
    console.log('Sending ' + memberIDs.length + ' orders to NetSuite.');
    let orders = memberIDs.map(m=>sendOrder(m['member_id'], year, month));
    while (orders.length > 1) await Promise.all(orders.splice(0, 10));
    if (orders.length === 1) await orders[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Send success emails with SES
async function sendSuccessEmails(year, month, pickLastDay = null) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription_renewal WHERE " +
      "year = ? AND month = ? AND is_resolved = 1 AND sent_email = 0 " +
      "ORDER BY member_id ASC LIMIT 1000;",
      [year, month]
    );
    if (memberIDs.length === 0) throw new Error('No members to send renewal success emails to.');
    console.log('Sending renewal success emails to ' + memberIDs.length + ' members.');
    let successes = memberIDs.map(m=>sendSuccessEmail(m['member_id'], year, month, pickLastDay));
    while (successes.length > 1) await Promise.all(successes.splice(0, 10));
    if (successes.length === 1) await successes[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Send failure emails with SES
async function sendFailureEmails(year, month, attempt, retry = false) {
  try {
    let memberIDs = await readQuery(
      "SELECT DISTINCT member_id FROM subscription_renewal WHERE " +
      "year = ? AND month = ? AND is_resolved = 0 AND has_failed = ? " +
      "ORDER BY member_id ASC LIMIT 1000;",
      [year, month, attempt]
    );
    if (memberIDs.length === 0) throw new Error('No members to send renewal failure emails to.');
    console.log('Sending renewal failure emails to ' + memberIDs.length + ' members.');
    let failures = memberIDs.map(m=>sendFailureEmail(m['member_id'], year, month, attempt, retry));
    while (failures.length > 1) await Promise.all(failures.splice(0, 10));
    if (failures.length === 1) await failures[0];
  } catch (e) {
    console.error(e);
  } finally {
    await endCluster();
  }
}

// Individual:
// prepareRenewal(252, 1, 5);
// chargeMember(252, 1, 5, 0);
// addSubscription(252, 1, 5, 0);
// sendOrder(252, 1, 5)
// sendSuccessEmail(252, 1, 5);
// sendFailureEmail(252, 1, 5, 0);

// Individual retry:
// updateRenewal(7, 1, 4, 1);
// sendSuccessEmail(2, 1, 4, 14);
// sendFailureEmail(2, 1, 4, 2, true);

// End of month:
// prepareRenewals(1, 5); // Month should be the last month we've shipped books for (i.e. this past month)
// chargeMembers(1, 5, 0);
// addSubscriptions(1, 5, 0); // New subscriptions will start on month + 1
// sendOrders(1, 5);
// sendSuccessEmails(1, 5);
// sendFailureEmails(1, 5, 1);

// First retry attempt for the 7th:
// updateRenewals(1, 5, 1);
// chargeMembers(1, 5, 1);
// addSubscriptions(1, 5, 1);
// sendOrders(1, 5);
// sendSuccessEmails(1, 5, 14); // Add last day of current picking period
// sendFailureEmails(1, 5, 2, true); // Set retry flag to true
