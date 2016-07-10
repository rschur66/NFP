import {FETCH_WEATHER} from '../actions/index'; 

export default function(state=[], action){

  switch (action.type){
    case FETCH_WEATHER:
      return state.concat([ action.payload.data ]);
      /* 
      return is an array here as we will get multiple cities coming back 
      and we want to collect them into an array.
      DO NOT USE PUSH as it mutates the state arry and state in IMUTABLE!!
      Instead creat new array with concat.
      */
  }

  return state;
}