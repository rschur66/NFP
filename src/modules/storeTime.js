const SET_STORE_TIME   	= 'SET_STORE_TIME';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_STORE_TIME:
    	return action.payload;
   	default:
   		return state;
  }
}

export function setStoreTime(time){
  return {
    type: SET_STORE_TIME,
    payload : time
  }
}
