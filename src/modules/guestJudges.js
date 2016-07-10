const SET_GUEST_JUDGES  = 'SET_GUEST_JUDGES';

export default function reducer(state = [], action){
  switch(action.type){
    case SET_GUEST_JUDGES:
      return action.payload;
    default:
      return state;
  }
}

export function setGuestJudges(judges){
  return {
    type: SET_GUEST_JUDGES,
    payload: judges
  }
}
