const SET_PRODUCTS  = 'SET_PRODUCTS';

export default function reducer(state = {}, action){
  switch(action.type){
    case SET_PRODUCTS:
      return action.payload;
    default:
      return state;
  }
}

export function setProducts(products){
  return {
    type: SET_PRODUCTS,
    payload: products
  }
}