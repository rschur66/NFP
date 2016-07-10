const SET_BRAINTREE_ERROR = 'SET_BRAINTREE_ERROR';
const CLEAR_BRAINTREE_ERROR = 'CLEAR_BRAINTREE_ERROR'

export default function reducer(state = null, action){
  switch(action.type){
    case SET_BRAINTREE_ERROR:
      return action.payload;
    case CLEAR_BRAINTREE_ERROR:
      return null;
    default:
      return state;
  }
}

export function setBraintreeError(err){
  return {
    type: SET_BRAINTREE_ERROR,
    payload: err
  }
}

export function clearBraintreeError(){
  return { type: CLEAR_BRAINTREE_ERROR }
}