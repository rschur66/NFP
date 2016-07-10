const SET_JUDGES  = 'SET_JUDGES';
import { setGuestJudges } from './guestJudges';

export default function reducer(state ={}, action){
  switch(action.type){
    case SET_JUDGES:
      return action.payload;
    default:
      return state;
  }
}

export function setJudges(judges){
  return {
    type: SET_JUDGES,
    payload: judges
  }
}

export function initializeJudges(judges){
  return (dispatch) => {
    dispatch( setJudges(judges) );
    return dispatch( setGuestJudges( Object.values(judges).filter( x => x.guest === 1) ));
  }
}

