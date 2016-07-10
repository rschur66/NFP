const SET_AUTHORS  = 'SET_AUTHORS';

export default function reducer(state = {}, action){
  switch(action.type){
    case SET_AUTHORS:
      return action.payload;
    default:
      return state;
  }
}

export function setAuthors(authors){
  return {
    type: SET_AUTHORS,
    payload: authors
  }
}