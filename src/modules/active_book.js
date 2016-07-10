const SET_ACTIVE_BOOK   	= 'SET_ACTIVE_BOOK';
const NO_ACTIVE_BOOK      = 'NO_ACTIVE_BOOK';
import { push } from 'react-router-redux';
import { hideJudge } from './active_judge';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_ACTIVE_BOOK:
    	return action.payload;
   	case NO_ACTIVE_BOOK:
   		return null;
   	default:
   		return state;
  }
}

function setActiveBook(book){
  return {
    type: SET_ACTIVE_BOOK,
    payload : book
  }
}

export function showBook(book){
  return (dispatch) => {
    dispatch(  hideJudge() );
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalOpen";
    return dispatch( setActiveBook(book) );
  }
}

export function hideBook(){
  return (dispatch, getState) => {
    if(getState().activeBook){
      let currentUrl = window.location.pathname;
      dispatch( push(currentUrl.slice(0, currentUrl.lastIndexOf('/'))+ '/') );
      if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
      dispatch(setNoActiveBook());
    }
    return;
  }
}

export function setNoActiveBook(){
  return { type: NO_ACTIVE_BOOK };
}
