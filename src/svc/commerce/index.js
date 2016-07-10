import {Router} from "express";
import bodyParser from "body-parser";
import * as commonmark from "commonmark";
import {getPromoPlan, getTaxRate, buyAndSendGift} from "./model";
import {getPromoPlan as getPlan} from "../member/model";
import {handleError} from "../utils";
import {sendReferFriend} from "../email/referFriend";
import {getClientToken, addPaymentMethod, getDefaultPayment, updatePaymentMethodInfo} from "../utils/braintree";

const bodyParserJSON = bodyParser.json();
const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();
const zipRE = /^\d{5}([\s-]\d*)?$/i;
const emailRE = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

//TODO add filter for accepted key values for add and update

async function addPayment(req, res, next) {
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  if (!req.body.nonce)
    return next({code: 403, message: 'Must provide nonce of payment to add.', body: 'body'});
  try {
    res.status(200).json(await addPaymentMethod(req.body.nonce, null, req.member));
  } catch (e) {
//    console.error(e);
    next({code: 500, message: 'Server error on addPayment.', body: e});
  }
}

async function updatePayment(req, res, next) {
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  if (!req.body.token)
    return next({code: 403, message: 'Must provide token of payment to update.', body: null});
  if (!req.body.cvv)
    return next({code: 403, message: 'Must provide cvv of payment to update.', body: null});
  if (!req.body.postalCode)
    return next({code: 403, message: 'Must provide postalCode of payment to update.', body: null});
  try {
    res.status(200).json(await updatePaymentMethodInfo(req.body));
  } catch (e) {
//    console.error(e);
    next({code: 500, message: 'Server error on updatePaymentMethodInfo.', body: e});
  }
}

async function getMemberBraintreeToken(req, res, next) {
  try {
    res.status(200).json(await getClientToken(req.member ? req.member.id : null));
  } catch (e) {
//    console.error(JSON.stringify(e));
    next({code: 500, message: 'Server error on getMemberBraintreeToken.', body: e});
  }
}

async function getPaymentMethod(req, res, next) {
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  try {
    res.status(200).json(await getDefaultPayment(req.member.id));
  } catch (e) {
//    console.error(e);
    next({code: 500, message: 'Server error on getPaymentMethod.', body: e});
  }
}

async function getPromotionalPlan(req, res, next) {
//  if (req.member) return next({code: 403, message: 'Current members are not eligible for promotions.', body: null});
  if (!req.params || !req.params['code']) return next({
    code: 400,
    message: 'Must pass promotion code for validation',
    body: null
  });
  try {
    let currentTime =  new Date();
    let result = await getPromoPlan(req.store.id, req.params["code"]);
    if( result && result.start_date && new Date(result.start_date) > currentTime)
      return res.status(200).json(null);
    else if(  result && result.end_date && new Date(result.end_date) < currentTime )
      return next({code: 400, message: 'Sorry, that promo code is no longer valid.'});
    res.status(200).json(result);
  } catch (e) {
    next({code: 500, message: "Server error on getPromotionalPlan.", body: 500});
  }
}

async function getZipCode(req, res, next) {
  if (!req.params || !req.params['zip']) return next({code: 400, message: 'Zip code required', body: null});
  if (!zipRE.test(req.params['zip'])) return next({code: 400, message: 'Invalid zip code.', body: null});
  try {
    let rate = await getTaxRate(req.params['zip']);
    res.status(200).json(rate);
  } catch (e) {
    return next({code: 500, message: 'Server error on getZipCode.', body: e});
  }
}

async function purchaseGift(req, res, next) {
  if (!req.body) return next({code: 400, message: 'Gift object required'});
  let gift = req.body;
  if (!emailRE.test(gift['giver_email'])) return next({code: 400, message: 'Giver e-mail required.'});
  if (!gift['giver_name']) return next({code: 400, message: 'Giver name required.'});
  if (gift['delivery_method'] != 'email' && gift['delivery_method'] != 'voucher')
    return next({code: 400, message: 'Must choose a delivery method.'});
  if (gift['delivery_method'] == 'email' && !emailRE.test(gift['recipient_email']))
    return next({code: 400, message: 'Recipient email required for email gift delivery.'});
  if (!gift['nonce'] && !gift['token']) return next({code: 400, message: 'Payment must be submitted with gift purchase.'});
  if (!gift['recipient_name']) return next({code: 400, message: 'Recipient name required.'});
  if (!gift['zipcode']) return next({code: 400, message: 'Zipcode required.'});
//  if (!gift['message']) return next({code: 400, message: 'Please send a message with your gift!'});
//  if (!gift['zip']) return next({code: 400, message: 'Zip code required for purchase.'});
/*
  if (gift['delivery_method'] == 'email' && new Date(gift['delivery_date']).getTime() + new Date().getTimezoneOffset() <= new Date().getTime())
    return next({code: 400, message: 'Delivery date cannot be in the past for e-mail delivery.'});
*/
  try {
    if (!(await getPlan(req.store.id, gift['plan_id'])))
      return next({code: 400, message: 'Valid gift plan required'});
    await buyAndSendGift(gift);
    res.status(200).end();
  } catch (e) {
//    console.error(e);
    next({code: 500, message: 'Server error on purchaseGift.', body: e})
  }
}

async function referFriend(req, res, next) {
  let referee_email = req.body.email;
  let referral_message = writer.render(reader.parse(req.body.referralMessage || ''));
  if (!referee_email || !emailRE.test(referee_email)) return next({code: 400, message: 'Valid email required.'});
  if (!req.member) return next({code: 400, message: 'Must be logged in to refer a friend.'});
  try {
    await sendReferFriend(req.member['first_name'], req.member['refer_code'], referral_message, referee_email);
    res.status(200).end();
  } catch (e) {
    next({code: 500, message: 'Server error on referFriend.', body: e});
  }
}

const router = Router();

router.get("/", getPaymentMethod);
router.get("/token", getMemberBraintreeToken);
// TODO: use HTTP verbs, GET/PUT/POST on '/payment' path
router.post("/addPayment", bodyParserJSON, addPayment);
router.post("/updatePayment", bodyParserJSON, updatePayment);
router.get("/promo/:code", getPromotionalPlan);
router.get("/ziptax/:zip", getZipCode);
router.post("/gift", bodyParserJSON, purchaseGift);
router.put("/refer", bodyParserJSON, referFriend);

router.use(handleError);

export default router;
