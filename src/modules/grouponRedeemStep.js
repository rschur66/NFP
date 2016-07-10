export const SET_GROUPON_REDEEM_STEP   	= 'SET_GROUPON_STEP';
export const SET_GROUPON_REDEEM_STEP_DEFAULT = 'SET_GROUPON_REDEEM_STEP_DEFAULT';
export const GROUPON_REDEEM_GROUPON       = 'groupon';
export const GROUPON_REDEEM_ACCOUNT      = 'account';
export const GROUPON_REDEEM_CONFIRMATION = 'confirmation';
import { push } from 'react-router-redux'

export const grouponRedeemStepHierarchy = { 'groupon': 0, 'account': 1, 'confirmation': 2 };

export default function reducer(state = GROUPON_REDEEM_GROUPON, action){
  switch(action.type){
    case SET_GROUPON_REDEEM_STEP:
    	return action.payload;
    case SET_GROUPON_REDEEM_STEP_DEFAULT:
      return GROUPON_REDEEM_GROUPON;
   	default:
   		return state;
  }
}

function pureGrouponRedeemStep(step){
  return {
    type: SET_GROUPON_REDEEM_STEP,
    payload : step
  }
}

function setGrouponRedeemStep(step){
  if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
  return (dispatch) => {
    dispatch(pureGrouponRedeemStep(step));
    dispatch(push('/promos/'+ step ));
  }
}

export function setGrouponRedeemStepAccount(){
  return setGrouponRedeemStep(GROUPON_REDEEM_ACCOUNT);
}

export function setGrouponRedeemStepConfirmation(){
  return setGrouponRedeemStep(GROUPON_REDEEM_CONFIRMATION);
}

export function resetGrouponRedeemStep(){
  return { type: SET_GROUPON_REDEEM_STEP_DEFAULT }
}