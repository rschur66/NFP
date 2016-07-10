const ADD_ENROLL_GENRE   	      = 'ADD_ENROLL_GENRE';
const REMOVE_ENROLL_GENRE       = 'REMOVE_ENROLL_GENRE';
const SET_ENROLL_FREQUENCY      = 'SET_ENROLL_FREQUENCY';
const SET_ENROLL_PLAN           = 'SET_ENROLL_PLAN';
const SET_ENROLL_TAX_RATE       = 'SET_ENROLL_TAX_RATE';
const SET_ENROLL_CLIENT_TOKEN   = 'SET_ENROLL_CLIENT_TOKEN';
const SET_ENROLL_STATUS         = 'SET_ENROLL_STATUS';
const SET_ENROLL_COUPON         = 'SET_ENROLL_COUPON';
const SET_GIFT_REDIRECT         = 'SET_GIFT_REDIRECT';
export const ENROLL_STATUS_PENDING     = 'pending';
export const ENROLL_STATUS_FAIL        = 'fail';
const CLEAR_ENROLL_STATUS       = 'CLEAR_ENROLL_STATUS';
const SET_ENROLL_ERROR          = 'SET_ENROLL_ERROR';
const CLEAR_ENROLL_ERROR        = 'CLEAR_ENROLL_ERROR';
const CLEAR_ENROLL_DATA         = 'CLEAR_ENROLL_DATA';
const SET_GIFT_CODE             = 'SET_GIFT_CODE';
const SET_GROUPON_CODE          = 'SET_GROUPON_CODE';
const SET_ENROLL_EMAIL          = 'SET_ENROLL_EMAIL';
const SET_NEW_MEMBER             = 'SET_NEW_MEMBER';
const CLEAR_NEW_MEMBER             = 'CLEAR_NEW_MEMBER';
import { get } from '../svc/utils/net';

const initialState = {
  genres: [],
  plan: null,
  frequency: null,
  tax_rate: 0.00,
  token: null,
  error: null,
  email: null,
  coupon: null,
  status: null,
  giftCode: null,
  grouponCode: null,
  giftRedirect: false
};

export default function reducer(state = initialState, action){
  switch(action.type){
    case ADD_ENROLL_GENRE:
    	return { ...state,
        genres: state.genres.concat([action.payload])};
    case REMOVE_ENROLL_GENRE:
      return { ...state,
        genres: state.genres.splice( state.genres.indexOf(action.payload), 1) };
   	case SET_ENROLL_FREQUENCY:
      return { ...state,
        frequency: action.payload };

    case SET_ENROLL_PLAN:
      return { ...state,
        plan: action.payload };

    case SET_ENROLL_COUPON:
      return { ...state,
        coupon: action.payload };
    case SET_ENROLL_TAX_RATE:
      return { ...state,
        tax_rate: action.payload };
    case SET_ENROLL_CLIENT_TOKEN:
      return { ...state,
        token: action.payload };
    case SET_ENROLL_STATUS:
      return { ...state,
        status: action.payload };
    case SET_GIFT_CODE: 
      return { ...state,
        giftCode: action.payload };
    case SET_GROUPON_CODE: 
      return { ...state,
        grouponCode: action.payload };
    case CLEAR_ENROLL_STATUS:
      return { ...state,
        status: null };
    case SET_ENROLL_ERROR:
      return { ...state,
        error: action.payload };
    case SET_NEW_MEMBER:
      return { ...state,
        newMember: true };
    case CLEAR_NEW_MEMBER:
      return { ...state,
        newMember: false };
    case SET_ENROLL_EMAIL:
      return { ...state,
        email: action.payload };
    case SET_GIFT_REDIRECT:
      return { ...state,
        giftRedirect: true };
    case CLEAR_ENROLL_ERROR:
      return { ...state,
        error: null };
    case CLEAR_ENROLL_DATA:
      return { ...initialState };
   	default:
   		return state;
  }
}

export function addEnrollGenre(genre){
  return {
    type: ADD_ENROLL_GENRE,
    payload: genre
  }
}

export function setEnrollClientToken(token){
  return {
    type: SET_ENROLL_CLIENT_TOKEN,
    payload: token
  }
}

export function removeEnrollGenre(genre){
  return {
    type: REMOVE_ENROLL_GENRE,
    payload: genre
  }
}

export function setEnrollFrequency(frequency){
  return {
    type: SET_ENROLL_FREQUENCY,
    payload: frequency
  }
}

export function getEnrollTaxRate(zip){
  return (dispatch) => {
    if( zip && zip.length >= 5 )
      get('/svc/commerce/ziptax/' + zip )
        .then( (res) => dispatch(setEnrollTaxRate(res.rate)))
        .catch( (err) => dispatch(setEnrollTaxRate(0)));
  }
}

export function setEnrollTaxRate(tax_rate){
  return {
    type: SET_ENROLL_TAX_RATE,
    payload: tax_rate
  }
}

export function setEnrollPlan(plan){
  return {
    type: SET_ENROLL_PLAN,
    payload: plan
  }
}

export function setEnrollCoupon(coupon){
  return {
    type: SET_ENROLL_COUPON,
    payload: coupon
  }
}

export function setEnrollStatusPending(){
  return {
    type: SET_ENROLL_STATUS,
    payload: ENROLL_STATUS_PENDING
  }
}

export function clearEnrollStatus(){
  return { type: CLEAR_ENROLL_STATUS };
}

export function setEnrollStatusFail(){
  return {
    type: SET_ENROLL_STATUS,
    payload: ENROLL_STATUS_FAIL
  }
}

export function setEnrollError(error){
  return {
    type: SET_ENROLL_ERROR,
    payload: error
  }
}

export function setGiftCode(code){
  return {
    type: SET_GIFT_CODE,
    payload: code
  }
}

export function setGrouponCode(code){
  return {
    type: SET_GROUPON_CODE,
    payload: code
  }
}

export function setGiftRedirect(){
  return { type: SET_GIFT_REDIRECT }
}

export function setEnrollEmail(email){
  return {
    type: SET_ENROLL_EMAIL,
    payload: email
  }
}

export function setNewMember(){
  return { type: SET_NEW_MEMBER }
}

export function clearNewMember(){
  return { type: CLEAR_NEW_MEMBER }
}

export function clearEnrollError(){
  return { type: CLEAR_ENROLL_ERROR }
}

export function clearEnrollData(){
  return { type: CLEAR_ENROLL_DATA }
}