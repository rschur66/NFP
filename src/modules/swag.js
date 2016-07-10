const SET_SWAG  = 'SET_SWAG';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_SWAG:
      return action.payload;
    default:
      return state;
  }
}

export function setSwag(swag){
  return {
    type: SET_SWAG,
    payload: swag
  }
}
