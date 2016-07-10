import {Router} from "express";
import bodyParser from "body-parser";
import {
  findMemberById,
  editMember,
  createNewMember,
  getIdByEmail,
  getGiftPlan,
  getGrouponPlan,
  getPromoPlan,
  saveLeadToDB,
  saveSuggestionToDB,
  saveMagazineLeadToDB,
  resetPassword,
  addGiftToAccount,
  changeRenewInto,
  login_duration,
  setPlan,
  signValue, 
  updateMemberAvatar
} from './model';
import {handleError} from '../utils';
import {validate} from '../utils/usps';
import {member_log} from "../utils/log";
import {exportLeadToST} from '../utils/sailthru';
import {sendPasswordReset} from '../email/passwordReset';
import AWS from 'aws-sdk';
import {aws} from '../../common/credentials';

const bodyParserJSON = bodyParser.json();
const emailRE = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const zipRE = /^(\d{5})(?:-(\d{4}))?$/i;
const memberFilter = new Map([
  ['phone', /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/i],
  ['email', /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i],
  ['display_name', /^[A-Z0-9]{3,63}$/i],
  ['first_name', /^[A-Z][A-Z0-9-]{2,22}$/i],
  ['last_name', /^[A-Z][A-Z0-9-]{2,22}$/i],
  ['password', /^.{4,20}$/i],
  ['picture_url', /^[A-Z0-9]{2,20}\.(jpg|png|gif|svg)$/i]]);
const addressFilter = new Map([
  ['name', /^.{,63}$/i],
  ['street1', /^.{2,63}$/i],
  ['street2', /^.{0,63}$/i],
  ['city', /^.{2,63}$/i],
  ['state', /^(AL)|(AK)|(AZ)|(AR)|(CA)|(CO)|(CT)|(DE)|(DC)|(FL)|(GA)|(HI)|(ID)|(IL)|(IN)|(IA)|(KS)|(KY)|(LA)|(ME)|(MD)|(MA)|(MI)|(MN)|(MS)|(MO)|(MT)|(NE)|(NV)|(NH)|(NJ)|(NM)|(NY)|(NC)|(ND)|(OH)|(OK)|(OR)|(PA)|(RI)|(SC)|(SD)|(TN)|(TX)|(UT)|(VT)|(VA)|(WA)|(WV)|(WI)|(WY)$/i],
  ['zip', /^\d{5}([\s-]\d{4})?$/i]
]);
const socialFilter = new Map([
  ['website', /^[-A-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-A-Z0-9@:%_\+.~#?&//=]*)$/i],
  ['facebook', /^[0-9]{1,20}$/i],
  ['twitter', /^[A-Z0-9]{1,20}$/i],
  ['tumblr', /^[A-Z0-9][-A-Z0-9]{,18}[A-Z0-9]$/i],
  ['instagram', /^[A-ZZ0-9][-A-Z0-9\.]{29}$/i]
]);

export async function sendMember(req, res, next) {
  try {
    if (req.member)
      if (req.reload)
        res.status(200).json(await findMemberById(req.store.id, req.member.id));
      else
        res.status(200).json(req.member);
    else
      next({code: 403, message: 'Not logged in.', body: 'You entered an invalid email or password. Please try again.'});
  } catch (e) {
    next({code: 500, message: 'Server error on sendMember.', body: e})
  }
}


async function updateMember(req, ignore, next) {
  let address = null, social = null;
  if (!req.member)
    return next({code: 403, message: 'Not logged in.', body: null});
  if (!req.body)
    return next({code: 400, message: 'Message body does not contain updates.', body: req.member});
  if (req.body.address) {
    for (const k of Object.keys(req.body.address))
      if (!(addressFilter.get(k) && addressFilter.get(k).test(req.body.address[k]))) delete req.body.address[k];
    if (Object.keys(req.body.address).length > 0) {
      req.body.address['name'] = req.body.address['name'] || (req.member['first_name'] + ' ' + req.member['last_name']);
      if (!(req.body.address['street1'] || req.body.address['street2']))
        return next({code: 400, message: 'Street information required to update address', body: req.member});
      if (!(req.body.address['city']))
        return next({code: 400, message: 'City required to update address', body: req.member});
      if (!(req.body.address['state']))
        return next({code: 400, message: 'State required to update address', body: req.member});
      if (!(req.body.address['zip']))
        return next({code: 400, message: 'Zip code required to update address', body: req.member});
      address = req.body.address;
    }
  }
  if (req.body.social) {
    for (const k of Object.keys(req.body.social)) {
      if (!socialFilter.get(k)) delete req.body.social[k];
      else if (!socialFilter.get(k).test(req.body.social[k])) req.body.social[k] = null;
    }
    social = req.body.social;
  }
  for (const k of Object.keys(req.body))
    if (!(memberFilter.get(k) && memberFilter.get(k).test(req.body[k]))) delete req.body[k];
  if ((req.body && Object.keys(req.body).length > 0) ||
    (social && Object.keys(social).length > 0) ||
    (address && Object.keys(address).length > 0)) {
    req.reload = true;
    try {
      next(await editMember(req.member.id, req.body, address, social));
      delete req.body.password;
      member_log(req.member.id, 'update', JSON.stringify(Object.assign(req.body, {address: address, social: social})));
    } catch (e) {
      console.error(e);
      next({code: 500, message: 'Server error on updateMember.', body: e});
    }
  } else {
    next({code: 400, message: 'Update member called with no allowed body.', body: req.member});
  }
}

async function createMember(req, res, next) {
  let member, social, address, plan,
    refer_code = req['cookies'] && req['cookies']['referCode'] ? req['cookies']['referCode'] : null;
  if (req.member) return next({code: 403, message: 'Already logged in!'});
  if (!req.body) return next({code: 403, message: 'Could not read message body.', body: null});
  if (req.body['social']) {
    for (const k of Object.keys(req.body.social)) {
      if (!socialFilter.get(k)) delete req.body.social[k];
      else if (!socialFilter.get(k).test(req.body.social[k])) req.body.social[k] = null;
    }
    social = req.body.social;
  } else social = null;
  if (!req.body.address) return next({code: 404, message: 'Address required to enroll.', body: null});
  address = req.body.address;
  for (const k of Object.keys(address))
    if (!(addressFilter.get(k) && addressFilter.get(k).test(address[k]))) delete address[k];
  if (Object.keys(address).length > 0) {
    address['name'] = address['name'] || (req.body['first_name'] + ' ' + req.body['last_name']);
    if (!(address['street1'] || address['street2']))
      return next({code: 400, message: 'Address requires street information', body: null});
    if (!(address['city']))
      return next({code: 400, message: 'Address requires city', body: null});
    if (!(address['state']))
      return next({code: 400, message: 'Address requires state', body: null});
    if (!(address['zip']))
      return next({code: 400, message: 'Address requires zip code', body: null});
  }
  if (!req.body['plan']) return next({code: 404, message: 'Plan must be selected to enroll.', body: null});
  plan = req.body['plan'];
  if (!plan['gift_code'] && !plan['nonce']) return next({
    code: 404,
    message: 'This plan requires a valid payment method.'
  });
  for (const k of Object.keys(req.body))
    if (!(memberFilter.get(k) && memberFilter.get(k).test(req.body[k]))) delete req.body[k];
  if (!req.body['first_name']) return next({code: 400, message: 'First name required', body: null});
  if (!req.body['last_name']) return next({code: 400, message: 'Last name required', body: null});
  if (!req.body['display_name']) return next({code: 400, message: 'Display name required', body: null});
  if (!req.body['email']) return next({code: 400, message: 'EMail address required', body: null});
  if (!req.body['password']) return next({code: 400, message: 'Password required', body: null});
  member = req.body;
  try {
    if (await getIdByEmail(member['email'])) return next({
      code: 400,
      message: 'That email is already in use. Please login.',
      body: null
    });
    if (plan['gift_code'] && !(await getGiftPlan(plan['gift_code'])))
      return next({code: 403, message: 'Gift code does not exist, or has already been redeemed.'});
    if (plan['groupon_code'] && !(await getGrouponPlan(plan['groupon_code'])))
      return next({code: 403, message: 'Groupon code does not exist, or has already been redeemed.'});
    if (plan['id'] && !(await getPromoPlan(req.store.id, plan['id'], plan['promo'])))
      return next({code: 403, message: 'Plan does not exist, or requires a promotional code to unlock.'});
    let ship_date = req.store.ship_days.reduce((p, d)=>d > new Date().getDate() ? Math.min(p, d) : p, 31);
    let response = await createNewMember(req.store.id, ship_date, member, social, address, plan, req.store.can_pick, refer_code);
    if (response.error) return next({code: 400, message: response.error});
    req.member = {id: response['newMemberId']};
    let timestamp = Date.now();
    res.cookie('email', member['email'], {maxAge: login_duration, httpOnly: true});
    res.cookie('timestamp', timestamp, {maxAge: login_duration, httpOnly: true});
    res.cookie('session', signValue(member['email'], timestamp), {maxAge: login_duration, httpOnly: true});
    req.reload = true;
    //remove from sailthru leads
    //await exportEnrollment(full_member_obj); //member needs plan info. see sqs tests for example
    next();
    delete member.password;
    member_log(req.member.id, 'create', JSON.stringify(Object.assign(member, {address: address, social: social})));
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Unspecified error creating account.', body: e});
  }
}

async function validateAddress(req, res, next) {
  let {street1, street2, city, state, zip} = req.body, zipA;
  zipA = zipRE.exec(zip);
  try {
    res.status(200).json(await validate(street1, street2, city, state, zipA[1], zipA[2]));
  } catch (e) {
    next({code: 500, message: 'Could not validate, unspecified error.', body: e});
  }
}

async function captureLead(req, res, next) {
  let email = req.query['email'], source = req.query['source'], type = req.query['type'];
  if (!emailRE.test(email))
    return next({code: 400, message: 'Invalid email format.', body: null});
  try {
    if (type === "magazine")
      await saveMagazineLeadToDB(req.store.id, email, source);
    else
      await saveLeadToDB(req.store.id, email, source);
    await exportLeadToST(email, source, req.store);
    res.status(200).end();
  } catch (e) {
    next({code: 500, message: 'Error saving email.', body: e})
  }
}



async function captureSuggestion(req, res, next) {
  let  storeId    = req.store.id,
       memberId   = req.query['member'], 
       suggestion = req.query['suggestion'];

console.log(storeId );
console.log(memberId );
console.log(suggestion );

  try {
    await saveSuggestionToDB(storeId, memberId, suggestion);
    res.status(200).end();
  } catch (e) {
    next({code: 500, message: 'Error saving suggestion.', body: e})
  }
}




async function memberLogout(req, res) {
  res.clearCookie('email', {});
  res.clearCookie('timestamp', {});
  res.clearCookie('session', {});
  res.status(200).end();
  if (req.member && req.member.id)
    member_log(req.member.id, 'logout', null);
}

async function passwordReset(req, res, next) {
  if (req.member) return next({
    code: 403,
    message: 'You\'re already logged in, password cannot be reset.',
    body: req.member
  });
  if (!req.query['email'] || !emailRE.test(req.query['email'])) return next({
    code: 404,
    message: 'Password reset requires a valid e-mail address.',
    body: null
  });
  try {
    let resetData = await resetPassword(req.store.id, req.query['email']);
    if (resetData) await sendPasswordReset(resetData.first_name, req.query['email'], resetData.token);
  } catch (e) {
    console.error('Error creating password reset: ' + e);
  } finally {
    res.status(200).end();
    member_log(req.member.id, 'passwordReset', req.query['email']);
  }
}

async function checkGiftPlan(req, res, next) {
  if (!req.params || !req.params['gift_code']) return next({code: 400, message: 'Gift code required.'});
  try {
    let plan = await getGiftPlan(req.params['gift_code']);
    if (plan) res.status(200).json(plan);
    else res.status(400).send('checkGiftPlan error: no plan').end();
  } catch (e) {
    next({code: 500, message: 'Server error on checkGiftPlan.', body: e});
  }
}

async function checkGrouponCode(req, res, next) {
  if (!req.params || !req.params['groupon_code']) return next({code: 400, message: 'Groupon code required.'});
  try {
    let plan = await getGrouponPlan(req.params['groupon_code']);
    if (plan) res.status(200).json(plan);
    else res.status(400).send('checkGiftPlan error: no plan').end();
  } catch (e) {
    next({code: 500, message: 'Server error on checkGrouponCode.', body: e});
  }
}

async function changeRenewAs(req, ignore, next) {
  if (!req.member) return next({code: 403, message: 'Must be logged in to change renewal plan.'});
  if (!req.params || !req.params['planId']) return next({code: 400, message: 'New PlanID required.'});
  if (!(await getPromoPlan(req.store.id, req.params['planId'])))
    return next({code: 400, message: 'PlanID is not a valid store plan.'});
  if (!req.member.subscription)
    return next({code: 400, message: 'Your membership has expired, please choose a new plan.'});
  let oldPlanId = req.member.subscription.plan_id;
  try {
    await changeRenewInto(req.store.id, req.member.id, req.params['planId']);
    req.reload = true;
    next();
    member_log(req.member.id, 'changeRenew', JSON.stringify({from: oldPlanId, to: req.params['planId']}));
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Server error on changeRenewAs.', body: e});
  }
}

async function applyGift(req, ignore, next) {
  if (!req.member) return next({code: 403, message: 'Must be logged in to add gift to a current account.'});
  if (!req.params || !req.params['gift_code']) return next({
    code: 400,
    message: 'Gift code missing.',
    body: req.member
  });
  try {
    let plan = await getGiftPlan(req.params['gift_code']);
    if (!plan) return next({code: 400, message: 'Invalid gift code sent.'});
    await addGiftToAccount(req.store.id, req.member.id, req.store.can_pick && req.member.can_pick, req.params['gift_code']);
    req.reload = true;
    next();
    member_log(req.member.id, 'applyGift', req.query['email']);
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Server error on applyGift:' + e, body: req.member})
  }
}

async function purchasePlan(req, ignore, next) {
  if (!req.member) return next({code: 403, message: 'Must be logged in!'});
  if (req.member['subscription']) return next({code: 404, message: 'User has a valid subscription.', body: req.member});
  if (!req.body) return next({code: 404, message: 'Plan & payment required.', body: req.member});
  let {plan_id, nonce, token, promo} = req.body;
  if (!(await getPromoPlan(req.store.id, plan_id, promo)))
    return next({code: 400, message: 'Invalid store plan or promotion.', body: req.member});
  if (!nonce && !token) return next({code: 404, message: 'Payment nonce missing.', body: req.member});
  let ship_date = req.store.ship_days.reduce((p, d)=>d > new Date().getDate() ? Math.min(p, d) : p, 31);
  let can_pick = req.member['can_pick'] && req.store['can_pick'];
  try {
    await setPlan(req.store.id, req.member.id, req.member['email'], can_pick, ship_date, plan_id, promo, nonce, token);
    req.reload = true;
    next();
    member_log(req.member.id, 'purchasePlan')
  } catch (e) {
    console.error(e);
    next({code: 500, message: 'Server error purchasing plan: ' + e, body: req.member});
  }
}

async function retrieveSignedURL(req, res, next) {
  if (!req.params.memberId)
    return next({code: 403, message: 'Not logged in.', body: null});
  try {
    let filename = `member${req.params.memberId}avatar`,
        params = {Bucket: 'botm-userphotos', Key: `userphotos-staging/${filename}`, ContentType: 'image/png'},
        s3 = new AWS.S3({'credentials': aws});
    let signedUrl = s3.getSignedUrl('putObject', params);
    res.status(200).json(signedUrl);
  } catch (e) {
    return next({code: 400, message: err, body: null});
  }
}


async function saveMemberAvatar(req, res, next) {
  if (!req.params.memberId)
    return next({code: 403, message: 'Not logged in.', body: null});
  try {
    await updateMemberAvatar(req.params.memberId);
    res.status(200);//.end;
  } catch (e) {
    return next({code: 400, message: err, body: null});
  }
}

const router = Router();

router.get("/", sendMember);
router.put("/", bodyParserJSON, updateMember, sendMember);
router.post("/", bodyParserJSON, createMember, sendMember);
router.post("/plan", bodyParserJSON, purchasePlan, sendMember);
router.post("/validateAddress", bodyParserJSON, validateAddress);
router.get("/gift/:gift_code", checkGiftPlan);
router.put("/gift/:gift_code", applyGift, sendMember);
router.get("/groupon/:groupon_code", checkGrouponCode);
router.get("/signedUrl/:memberId", retrieveSignedURL);
router.get("/saveMemberAvatar/:memberId", saveMemberAvatar);
router.get("/lead", captureLead);
router.get("/logout", memberLogout);
router.get("/passwordReset", passwordReset);
router.get("/renewInto/:planId", changeRenewAs, sendMember);


router.get("/selectionSuggestion", captureSuggestion);


router.use(handleError);

export default router;
