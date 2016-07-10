export default function(state = null, action){
  /* First arg is always state
  State is set to null for initial app load when state is not yet avaialble
  otherwise it would be 'undefined' and will throw error.
  */
  switch(action.type){
    case 'BOOK_SELECTED' :
    return  action.payload;
  }

  return state
}