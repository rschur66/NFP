const SET_MEMBER  = 'SET_MEMBER';
const CLEAR_MEMBER = 'CLEAR_MEMBER';
const SET_MEMBER_PAYMENT_METHOD = 'SET_MEMBER_PAYMENT_METHOD';
const SET_MEMBER_TOKEN = 'SET_MEMBER_TOKEN';

import { get, put, post } from '../svc/utils/net';
import { push } from 'react-router-redux'
import { clearLoginError, setLoginError } from './loginError';
import { setEnrollStatusFail, setEnrollError, clearEnrollData, clearEnrollStatus } from './enrollData';
import { setEnrollStepConfirmation, resetEnrollStep } from './enrollStep';
import { analyticsEnrollTracking } from './analytics';
import { resetGiftStep } from './giftStep';
import { setGiftRedeemStepConfirmation, resetGiftRedeemStep } from './giftRedeemStep';
import { setGrouponRedeemStepConfirmation, resetGrouponRedeemStep } from './grouponRedeemStep';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_MEMBER:
      if (state && state.paymentMethod) {
        return { ...action.payload, 
          paymentMethod: state.paymentMethod, 
          token: state.token };
      } else {
        return action.payload;
      }
    case CLEAR_MEMBER:
      return null;
    case SET_MEMBER_PAYMENT_METHOD:
      return { ...state,
        paymentMethod: action.payload };
    case SET_MEMBER_TOKEN:
      return { ...state,
        token: action.payload };
    default:
      return state;
  }
}

export function setMember(member){
  return {
    type: SET_MEMBER,
    payload: member
  }
}

export function clearMember(){
  return { type: CLEAR_MEMBER };
}

export function setMemberPaymentMethod(payment){
  return {
    type: SET_MEMBER_PAYMENT_METHOD,
    payload: payment
  }
}

export function setMemberToken(token){
  return {
    type: SET_MEMBER_TOKEN,
    payload: token
  }
}

export function memberLogout(){
  return (dispatch) => {
    dispatch( clearEnrollData());
    dispatch( resetGiftStep());
    dispatch( resetGiftRedeemStep());
    dispatch( resetGrouponRedeemStep());
    dispatch( resetEnrollStep());
    dispatch(clearMember());
    dispatch( push('/') );
    let response = get( '/svc/member/logout/' )
      .catch( (err) => console.log(err));
  }
}

export function memberLogin(oFormData){
	return (dispatch, getState) => {
    dispatch(clearLoginError());
    let response = get( '/svc/member?email='
      + oFormData['email'] + '&password='
      + oFormData['password']
    ).then( (res) => {
      console.log('res:', res);
      dispatch( setMember(res) );
      if (getState().enrollData.giftRedirect) return dispatch( push('/gift/redeem') );
      else if (getState().member.subscription===null) return dispatch( push('/renewal') );
      else if (getState().member.can_pick) return dispatch( push('/my-botm') );
      else if (!getState().member.can_pick) return dispatch( push('/my-box') );
      // (3) 28th - 1st.  Land on Next Months Box.
      //(4) New members who join after the 21st should land on Next months Box.
    }).catch( function (err) {

      console.log(err.message);
      dispatch( setLoginError(err.message));
      return dispatch( clearMember());
    });
  }
}

export function memberResetPassword(email) {
  get('/svc/member/passwordReset?email=' + email)
  .then( (res) => {
    return res;
  }).catch( (err) => {
    console.log(err);
  });
}

export function createMember(accountObj, gift=false, groupon=false){
  return (dispatch) => {
    post( '/svc/member', accountObj)
    .then( (res) => {
      dispatch( setMember(res) );
      dispatch( clearEnrollStatus() );
      if (groupon) dispatch( setGrouponRedeemStepConfirmation() );
      else if (gift) dispatch( setGiftRedeemStepConfirmation() );
      else {
        dispatch( setEnrollStepConfirmation() );
        dispatch( analyticsEnrollTracking(res) );
      }
    }).catch( function (err) {
      dispatch( setEnrollStatusFail());
      dispatch( setEnrollError(err.message));
      if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
    });
  }
}

export function addGiftPlan(gift){
  return (dispatch) => {
    put('/svc/member/gift/' + gift )
      .then( res => {
        dispatch(setMember(res));
        dispatch(setGiftRedeemStepConfirmation());
      }).catch( err => {
        dispatch( setEnrollStatusFail());
        dispatch( setEnrollError(err.message));
      });
  }
}

export function createMemberReferral(referObj) {
  put('/svc/commerce/refer', referObj)
  .then( (res) => {
    return res;
  }).catch( (err) => {
    console.log('createMemberReferral error: ', err);
  });
}

export function changeRenewalPlan(plan_id){
  return (dispatch) => {
    get('/svc/member/renewInto/' + plan_id)
      .then( res =>  dispatch(setMember(res)) )
      .catch( err =>  console.log('failure to change'));
  }
}

export function updateMemberInfo(updateObj){
  return (dispatch) => {
    let response = put( '/svc/member', updateObj )
    .then( (res) => dispatch( setMember(res) ))
    .catch( (err) =>  console.log('Error updating member info: ', err));
  }
}

export function updateMemberShipping(updateObj){
  return (dispatch) => {
    let response = put( '/svc/member', updateObj )
    .then( res => dispatch( setMember(res)))
    .catch( err => console.log(err) )
  }
}