const SET_ACTIVE_JUDGE  = 'SET_ACTIVE_JUDGE';
const NO_ACTIVE_JUDGE    = 'NO_ACTIVE_JUDGE';

import { setNoActiveBook } from './active_book';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_ACTIVE_JUDGE :
    	return action.payload;
    case NO_ACTIVE_JUDGE:
    	return null;
  	default:
  		return state;
  }
}


export function showJudgeModal(judge){
  return (dispatch) => {
    dispatch(  setNoActiveBook() );
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalOpen";
    return dispatch( setActiveJudge(judge) );
  }
}

export function setActiveJudge(judge){
  return {
    type: SET_ACTIVE_JUDGE,
    payload : judge
  }
}

export function hideJudge(){
  if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
  return { type: NO_ACTIVE_JUDGE }
}
