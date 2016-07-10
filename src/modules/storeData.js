const SET_STORE_DATA 	= 'SET_STORE_DATA';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_STORE_DATA:
    	return action.payload;
   	default:
   		return state;
  }
}

export function setStoreData( can_pick, ship_days, ship_date, plans, gift_plans, renewal_plans ){
  return {
    type: SET_STORE_DATA,
    payload : { can_pick, ship_days, ship_date, plans, gift_plans, renewal_plans }
  }
}
