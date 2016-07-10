const SET_LOGIN_ERROR   	   = 'SET_LOGIN_ERROR';
const CLEAR_LOGIN_ERROR      = 'CLEAR_LOGIN_ERROR';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_LOGIN_ERROR:
    	return action.payload;
   	case CLEAR_LOGIN_ERROR:
   		return null;
   	default:
   		return state;
  }
}

export function setLoginError(error){
  return {
    type: SET_LOGIN_ERROR,
    payload : error
  }
}

export function clearLoginError(){
  return { type: CLEAR_LOGIN_ERROR }
}
