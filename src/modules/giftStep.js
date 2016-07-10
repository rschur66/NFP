export const SET_GIFT_STEP   	= 'SET_GIFT_STEP';
export const SET_GIFT_STEP_DEFAULT = 'SET_GIFT_STEP_DEFAULT';
export const GIFT_PLAN         = 'give';
export const GIFT_ACCOUNT      = 'gift-account';
export const GIFT_CONFIRMATION = 'purchase-confirmation';
import { push } from 'react-router-redux'

export const giftStepHierarchy = { 'give': 0, 'gift-account': 1, 'purchase-confirmation': 2 };

export default function reducer(state = GIFT_PLAN, action){
  switch(action.type){
    case SET_GIFT_STEP:
    	return action.payload;
    case SET_GIFT_STEP_DEFAULT:
      return GIFT_PLAN;
   	default:
   		return state;
  }
}

function pureEnrollStep(step){
  return {
    type: SET_GIFT_STEP,
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

export function setGiftStepAccount(){
  return setGiftStep(GIFT_ACCOUNT);
}

export function setGiftStepConfirmation(){
  return setGiftStep(GIFT_CONFIRMATION);
}

export function resetGiftStep(){
  return { type: SET_GIFT_STEP_DEFAULT }
}