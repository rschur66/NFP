const SET_MAGAZINE  = 'SET_MAGAZINE';

export default function reducer(state = {}, action){
  switch(action.type){
    case SET_MAGAZINE:
      return action.payload;
    default:
      return state;
  }
}

export function setMagazine(mag){
  return {
    type: SET_MAGAZINE,
    payload: mag
  }
}