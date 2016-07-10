import { setMember } from './member';
import { get } from '../svc/utils/net';

export function setBOTM(book_id){
  return (dispatch) => {
    get('/svc/box/bom/' + book_id )
      .then( res => dispatch(setMember(res)) )
      .catch( err => console.log( 'fail', err))
  }
}

export function addToBox(book_id){
  return (dispatch) => {
    get('/svc/box/add/' + book_id )
      .then( res => dispatch(setMember(res)) )
      .catch( err => console.log( 'fail', err));
  }
}

export function removeFromBox(book_id){
  return (dispatch) => {
    get('/svc/box/rem/' + book_id )
      .then( res => dispatch(setMember(res)) )
      .catch( err => console.log( 'fail', err) );
  }
}

export function skipThisMonth(book_id){
  return (dispatch) => {
    get('/svc/box/skip/')
      .then( res => dispatch(setMember(res)))
      .catch( err => console.log( 'fail', err));
  }
}