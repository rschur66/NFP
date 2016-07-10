const SET_FEATURES  = 'SET_FEATURES';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_FEATURES:
      return action.payload;
    default:
      return state;
  }
}

export function setFeatures(features){
  return {
    type: SET_FEATURES,
    payload: features
  }
}
