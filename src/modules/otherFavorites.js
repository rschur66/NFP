const SET_OTHER_FAVORITES  = 'SET_OTHER_FAVORITES';

export default function reducer(state = null, action){
  switch(action.type){
    case SET_OTHER_FAVORITES:
      return action.payload;
    default:
      return state;
  }
}

export function setOtherFavorites(favorites){
  return {
    type: SET_OTHER_FAVORITES,
    payload: favorites
  }
}
