export const SET_GIFT_REDEEM_STEP   	= 'SET_GIFT_STEP';
export const SET_GIFT_REDEEM_STEP_DEFAULT = 'SET_GIFT_REDEEM_STEP_DEFAULT';
export const GIFT_REDEEM_FREQUENCY    = 'frequency';
export const GIFT_REDEEM_REDEEM       = 'redeem';
export const GIFT_REDEEM_GENRE        = 'genre';
export const GIFT_REDEEM_ACCOUNT      = 'account';
export const GIFT_REDEEM_CONFIRMATION = 'confirmation';
import { push } from 'react-router-redux'

export const giftRedeemStepHierarchy = { 'redeem': 0, 'genre': 1, 'frequency': 2, 'account': 3, 'confirmation': 4 };

export default function reducer(state = GIFT_REDEEM_REDEEM, action){
  switch(action.type){
    case SET_GIFT_REDEEM_STEP:
    	return action.payload;
    case SET_GIFT_REDEEM_STEP_DEFAULT:
      return GIFT_REDEEM_REDEEM;
   	default:
   		return state;
  }
}

function pureEnrollStep(step){
  return {
    type: SET_GIFT_REDEEM_STEP,
    payload : step
  }
}

function setGiftStep(step){
  if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
  return (dispatch) => {
    dispatch(pureEnrollStep(step));
    dispatch(push('/gift/'+ step ));
  }
}

export function setGiftRedeemStepFrequency(){
  return setGiftStep(GIFT_REDEEM_FREQUENCY);
}

export function setGiftRedeemStepGenre(){
  return setGiftStep(GIFT_REDEEM_GENRE);
}

export function setGiftRedeemStepAccount(){
  return setGiftStep(GIFT_REDEEM_ACCOUNT);
}

export function setGiftRedeemStepConfirmation(){
  return setGiftStep(GIFT_REDEEM_CONFIRMATION);
}

export function resetGiftRedeemStep(){
  return { type: SET_GIFT_REDEEM_STEP_DEFAULT }
}