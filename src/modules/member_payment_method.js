import { setMemberPaymentMethod, setMemberToken, setMember } from './member';
import { setEnrollClientToken, setEnrollStatusFail, setEnrollError, getEnrollTaxRate, clearEnrollStatus } from './enrollData';
import { setBraintreeError }       from './braintreeError';
import { setGiftStepConfirmation } from './giftStep';
import { push }                    from 'react-router-redux'
import { get, post }               from '../svc/utils/net';


export function addPaymentMethod( addObj ){
  return (dispatch) => {
    post('/svc/commerce/addPayment', addObj )
      .then( res => dispatch( getPaymentMethod() ))
      .catch( err => dispatch(setBraintreeError(err.message)));
  }
}

export function editPaymentMethod(updateObj){
  return (dispatch) => {
    post('/svc/commerce/updatePayment', updateObj )
      .then( res => dispatch( getPaymentMethod() ))
      .catch( err => dispatch(setBraintreeError(err.message)));
  }
}

export function getPaymentMethod(){
  return (dispatch) => {
    get('/svc/commerce')
      .then( res => {
        dispatch(setMemberPaymentMethod(res));
        dispatch(getEnrollTaxRate(res.billingAddress.postalCode));
      }).catch( err => console.log( 'failed to get payment methods', err));
  }
}

export function getClientToken(){
    return (dispatch, getState) => {
      if(!(global && global.serving)) // only run if its on the client
        get( '/svc/commerce/token')
          .then( res => {
            if( getState().member ) return dispatch(setMemberToken(res));
            else return dispatch(setEnrollClientToken(res));
          }).catch( err => console.log('failed to get client token', err));
    }
}

export function purchaseGift(giftObj){
  return (dispatch, getState) => {
    post( '/svc/commerce/gift', giftObj)
      .then( res => {
        dispatch(setGiftStepConfirmation());
        dispatch(clearEnrollStatus());

      }).catch( err => {
        dispatch( setEnrollStatusFail());
        dispatch( setEnrollError(err.message));
        if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
      });
  }
}

export function memberReenroll(reenrollObj){
  return (dispatch) => {
    post('/svc/member/plan', reenrollObj)
    .then( (res) => {
      console.log('enroll res:', res);
      dispatch(clearEnrollStatus());
      dispatch( setMember(res) );
      dispatch(push('/renewal-confirmation'));
    }).catch( function (err) {
      console.log('error:', err);
      dispatch( setEnrollStatusFail());
      dispatch( setEnrollError(err.message));
    });
  }
}