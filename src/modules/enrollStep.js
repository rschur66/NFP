export const SET_ENROLL_STEP   	= 'SET_ENROLL_STEP';
export const SET_ENROLL_STEP_DEFAULT = 'SET_ENROLL_STEP_DEFAULT';
export const ENROLL_FREQUENCY    = 'frequency';
export const ENROLL_GENRE        = 'genre';
export const ENROLL_EMAIL        = 'email';
export const ENROLL_PLAN         = 'plan';
export const ENROLL_ACCOUNT      = 'account';
export const ENROLL_CONFIRMATION = 'confirmation';
import { push } from 'react-router-redux'

export const stepHierarchy = { 'genre': 0, 'frequency': 1, 'email': 2, 'plan': 3,
  'account': 4, 'confirmation': 5 };

export default function reducer(state = ENROLL_GENRE, action){
  switch(action.type){
    case SET_ENROLL_STEP:
    	return action.payload;
    case SET_ENROLL_STEP_DEFAULT:
      return ENROLL_GENRE;
   	default:
   		return state;
  }
}

function pureEnrollStep(step){
  return {
    type: SET_ENROLL_STEP,
    payload : step
  }
}

function setEnrollStep(step){
  if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
  return (dispatch) => {
    dispatch(pureEnrollStep(step));
    dispatch(push('/enroll/'+ step ));
  }
}

export function setEnrollStepFrequency(){
  return setEnrollStep(ENROLL_FREQUENCY);
}

export function setEnrollStepGenre(){
  return setEnrollStep(ENROLL_GENRE);
}

export function setEnrollStepEmail(){
  return setEnrollStep(ENROLL_EMAIL);
}

export function setEnrollStepAccount(){
  return setEnrollStep(ENROLL_ACCOUNT);
}

export function setEnrollStepConfirmation(){
  return setEnrollStep(ENROLL_CONFIRMATION);
}

export function setEnrollStepPlan(){
  return setEnrollStep(ENROLL_PLAN);
}

export function resetEnrollStep(){
  return { type: SET_ENROLL_STEP_DEFAULT }
}