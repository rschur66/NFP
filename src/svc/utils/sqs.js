/*
 * NEVER include this in a client-side file.  It may work, and it will import credentials.
 */
import {SQS} from "aws-sdk";
import {awsConfig} from "../../common/config";
import dateFormat from "dateformat";

const sqs = new SQS(awsConfig.sqs);
const endPoints = {
  member: awsConfig.sqs.queues.member,
  enrollment: awsConfig.sqs.queues.enrollment,
  invoice: awsConfig.sqs.queues.invoice,
  subscription: awsConfig.sqs.queues.subscription,
  giftPurchase: awsConfig.sqs.queues.giftPurchase,
  giftRedeem: awsConfig.sqs.queues.giftRedeem
};
const nsCcTypes = {
  "D": "3",
  "M": "4",
  "V": "5",
  "A": "6"
};

function formatIdForNS(id) {
  return 'botm' + id;
}

function assembleParams(url, msg, keyValue) {
  if (typeof msg !== 'string') {
    msg = JSON.stringify(msg);
  }
  return {
    MessageBody: msg,
    QueueUrl: url,
    MessageAttributes: {
      key: {
        DataType: 'String',
        StringValue: keyValue
      }
    }
  };
}

async function send(params) {
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) console.error(err);
      err ? reject(err) : resolve(data);
    });
  });
}

export function buildEnrollment(member) {
  return {
    "customer_external_id": formatIdForNS(member.id), //"botm" + member.id
    "customer_first_name": member.first_name,
    "customer_last_name": member.last_name,
    "customer_email": member.email,
    "customer_phone": member.phone || "",
    "customer_club": 'bok',
    "customer_e_primary": true,
    "customer_addresses": [
      {
        "address_addressee": member.address.name,
        "address_line_1": member.address.street1,
        "address_line_2": member.address.street2,
        "address_line_3": "",
        "address_city": member.address.city,
        "address_state": member.address.state,
        "address_zip": member.address.zip,
        "address_phone": member.phone || "",
        "address_default_billing": true,
        "address_default_shipping": true
      }
    ]
  };
}

export async function exportEnrollment(memberObjExpected) {
  return await send(assembleParams(endPoints.enrollment, memberObjExpected, 'botm-enrollment'));
}

export function buildPlanPurchase(member_id, order_id, address, purchase_date, mmid, price, auth) {
  return {
    "customer_external_id": formatIdForNS(member_id),
    "order_id": "BOM" + order_id,
    "order_type": "Subscription",
    "order_source": "ECOM",
    "order_date": dateFormat(purchase_date, 'yyyy-mm-dd'),
    "payment_auth": auth,
    "payment_type": "",
    "payment_last_four": "",
    "ship_addressee": "",
    "ship_addr1": "",
    "ship_addr2": "",
    "ship_city": "",
    "ship_state": "",
    "ship_zip": "",
    "bill_addressee": address.name,
    "bill_addr1": address.street1,
    "bill_addr2": address.street2,
    "bill_city": address.city,
    "bill_state": address.state,
    "bill_zip": address.zip,
    "line_items": [
      {
        "item_mmid": mmid,
        "item_rate": price
      }
    ]
  };
}

export async function exportPlanPurchase(sqsObj) {
  return await send(assembleParams(endPoints.invoice, sqsObj, 'botm-invoice'));
}

export function buildBookPurchase(member_id, order_id, auth, cardType, last4, items, name, street1, street2, city, state, zip) {
  return {
    "customer_external_id": formatIdForNS(member_id),
    "order_id": "BOM" + order_id,
    "order_type": "Positive",
    "order_source": "ECOM",
    "order_date": dateFormat(new Date(), 'yyyy-mm-dd'),
    "payment_auth": auth,
    "payment_type": cardType,
    "payment_last_four": last4,
    "ship_addressee": name,
    "ship_addr1": street1,
    "ship_addr2": street2,
    "ship_city": city,
    "ship_state": state,
    "ship_zip": zip,
    "bill_addressee": name,
    "bill_addr1": street1,
    "bill_addr2": street2,
    "bill_city": city,
    "bill_state": state,
    "bill_zip": zip,
    "line_items": JSON.parse(items)
  };
}

export async function exportBookPurchase(sqsObj) {
  return await send(assembleParams(endPoints.invoice, sqsObj, 'botm-invoice'));
}

export function buildGiftPurchase(member_id, gift_id, purchaser_email, auth, mmid, price, zip) {
  return {
    "order_id": 'GIFT' + gift_id,
    "order_type": "Gift",
    "order_source": "ECOM",
    "order_date": new Date().toISOString().split('T')[0],
    "customer_id": member_id ? 'BOTM' + member_id : null,
    "customer_email": purchaser_email,
    "bill_zip": zip,
    "payment_auth": auth,
    "line_items": [{
      "item_mmid": mmid,
      "item_rate": price
    }]
  };
}

export async function exportGiftPurchase(sqsObj) {
  return await send(assembleParams(endPoints.giftPurchase, sqsObj, 'botm-giftpurchase'));
}

export function buildGiftEnroll(gift_id, redeemer_email, redeemer_firstname, redeemer_lastname) {
  return {
    "customer_external_id": 'GIFT' + gift_id,
    "customer_fulfillment": "Gift Purchaser",
    "customer_club": "bok",
    "customer_email": redeemer_email,
    "customer_first_name": redeemer_firstname,
    "customer_last_name": redeemer_lastname
  };
}

export async function exportGiftEnroll(sqsObj) {
  return await send(assembleParams(endPoints.giftRedeem, sqsObj, 'botm-giftenroll'));
}

export function buildGiftRedeem(gift_id) {
  return {
    "gift_id": 'GIFT' + gift_id,
    "tran_date": new Date().toISOString().split('T')[0]
  };
}

export async function exportGiftRedeem(sqsObj) {
  return await send(assembleParams(endPoints.giftRedeem, sqsObj, 'botm-giftredeem'));
}

async function test() {
  let member = {
    "id": 12278,
    "netsuite_id": 6632259,
    "store_id": 1,
    "first_name": "Guest",
    "last_name": "BOTM",
    "display_name": "GuestBOTM",
    "email": "guest@bookofthemonth.com",
    "phone": "",
    "status": "Inactive",
    "type": "Member",
    "enroll_date": 1457988497000,
    "picture_url": "placeholder.jpg",
    "source": "EST1926",
    "password_hash": "13de99a996a5ba9ce088713cbf8aa2049ea549ecafd17b221b687465",
    "test": 0,
    "address": {
      "name": "Guest BOTM",
      "street1": "34 27th Street",
      "street2": "",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "id": 8095
    },
    "box": [
      109
    ],
    "box_history": {
      "1": {
        "2": [
          103,
          107
        ],
        "4": [
          110
        ]
      }
    },
    "can_pick": true,
    "social": {
      "website": null,
      "facebook": null,
      "twitter": null,
      "tumblr": null,
      "instagram": null
    },
    "plan": {"months": 3} //@TODO <-- added in plan but that's not in member obj yet!
  };

  await exportEnrollment(member);
  console.log('Passed exportEnrollment');
  //await exportInvoice({email: 'testing@bookspan.com'});
  //console.log('Passed export invoice');
  await exportMember(member);
  console.log('Passed exportMember');
}

if (require.main === module) {
  DEBUG_LOG_ALL = true;

  test()
    .then(() => {
      console.log('>>DONE!');
      process.exit(0);
    })
    .catch((err) => {
      console.log('\nFAIL>>', err, err.stack);
      process.exit(0);
    });
}