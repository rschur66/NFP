import {
  readQuery,
  getWriteConn,
  queryConnection,
  beginTransaction,
  commitTransaction,
  rollback,
  releaseConnection
} from "../utils/db";
import {createVoucher} from "./generateVoucher";
import {sendGiftPurchaseConfirmation} from "../email/giftPurchaseConfirmation";
import {authPurchase, cancelTransaction} from "../utils/braintree.js";
import dateFormat from "dateformat";

export async function getPromoPlan(store_id, code) {
  let plan = await readQuery('SELECT * FROM plan WHERE store_id = ? AND promo = ? ', [store_id, code]);
  return plan[0];
}

export async function getTaxRate(zip) {
  if (!zip) return {zip5: zip, rate: 0.00};
  let rate = await readQuery('SELECT zip5, rate FROM zip_tax WHERE zip5 = ?', [('00000' + zip.substr(0, 5)).substr(-5)]);
  return rate.length > 0 ? rate[0] : {zip5: zip, rate: 0.00};
}

export async function buyAndSendGift(gift) {
  let conn = null, transaction = null,
    gift_code = Math.random().toString(36).slice(2, 10),
    voucher_code = Math.random().toString(36).slice(2);
  try {
    let {plan_id, nonce, token, giver_name, giver_email, recipient_name, recipient_email, message, delivery_method, delivery_date, zipcode} = gift;
    conn = await getWriteConn();
    await beginTransaction(conn);
    let plans = await queryConnection(conn, 'SELECT * FROM plan WHERE id = ?;', [plan_id]), plan = plans[0];
    let {rate} = await getTaxRate(zipcode) || 0.00;
    let price = plan['price'] * (1 + rate);
    transaction = await authPurchase(nonce, token, price, plan["months"]);
    let result = await queryConnection(conn,
      'INSERT gift (gift_code, voucher_code, message, plan_id, giver_name, giver_email, recipient_name, recipient_email, ' +
      'delivery_method, bt_transaction_id, bt_transaction_amt, purchase_date, delivery_date, delivered, redeemed) ' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,current_timestamp,?,false,false);',
      [gift_code, voucher_code, message, plan_id, giver_name, giver_email, recipient_name, recipient_email,
        delivery_method, transaction.id, price, new Date(delivery_date)]);
    let gift_id = result.insertId;
    await createVoucher(voucher_code, gift_code, plan['name'], message);
    let emailDate = new Date(delivery_date);
    emailDate.setMinutes(emailDate.getMinutes() + emailDate.getTimezoneOffset());
    emailDate = dateFormat(emailDate, "dddd, mmmm dS, yyyy");
    await sendGiftPurchaseConfirmation(giver_name, recipient_name, plan['name'], emailDate, delivery_method,
      voucher_code, transaction.id, plan['price'], rate * plan['price'], giver_email);
/*
    let sqsObj = await buildGiftPurchase(null, gift_id, giver_email, transaction.id, plan['mmid'], plan['price'], zipcode);
    result = await queryConnection(conn, 'INSERT sqs_log (queue, object, sent) values (\'GIFTPURCHASE\',?, false)', [JSON.stringify(sqsObj, null, 2)]);
    try {
      let sqsResult = await exportGiftPurchase(sqsObj);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = true, response = ? WHERE id = ?', [JSON.stringify(sqsResult, null, 2), result.insertId]);
    } catch (e) {
      console.error('Failed to export enrollment: ' + e);
      await queryConnection(conn, 'UPDATE sqs_log SET sent = false, response = ? WHERE id = ?', [JSON.stringify(e, null, 2), result.insertId]);
    }
*/
    await commitTransaction(conn);
  } catch (e) {
    console.error(e);
    if (transaction) await cancelTransaction(transaction.id);
    if (conn) await rollback(conn);
    throw e;
  } finally {
    if (conn) await releaseConnection(conn);
  }
}