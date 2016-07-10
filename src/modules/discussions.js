const SET_DISCUSSIONS  = 'SET_DISCUSSIONS';
import { get, post, put } from '../svc/utils/net';
import { push } from 'react-router-redux'

export default function reducer(state = [], action){
  switch(action.type){
    case SET_DISCUSSIONS:
    	return action.payload;
   	default:
   		return state;
  }
}

export function setDiscussions(discussions){
  return {
    type: SET_DISCUSSIONS,
    payload : discussions
  }
}

export function getDiscussions( params ){
  let { type, product_id, month, year } = params;
  return (dispatch) => {
    if(type === 'product' && product_id ) return dispatch(getDiscussionsByProduct(product_id));
    else if( type === 'month' && month && year ) return dispatch(getDiscussionsByMonth(month, year));
    else return dispatch(getDiscussionsByMonth());
  }
}

function getDiscussionsByProduct( productId ){
  return (dispatch) => {
    get('/svc/discussion/product/' + productId)
      .then( function (res) {
        return dispatch(setDiscussions(res));
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}

function getDiscussionsByMonth( month=null, year=null ){
  return (dispatch, getState) => {
    let productIds = null,
        storeTime = new Date(getState().storeTime),
        previousMonth = new Date(new Date().setMonth( storeTime.getMonth() -1 ));
    if( month && year ) productIds = getState().features[parseInt(year) - 2015][parseInt(month)].featured.toString();
    else {
     if( storeTime.getDate() >= getState().storeData.ship_days[1] + 2 )
       productIds = getState().features[storeTime.getFullYear() - 2015][storeTime.getMonth()].featured.toString();
     else
        productIds = getState().features[previousMonth.getFullYear() - 2015][previousMonth.getMonth()].featured.toString();
    }

    get('/svc/discussion/product/' + productIds)
      .then( function (res) {
        return dispatch(setDiscussions(res));
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}

export function createDiscussion(discussionObj){
  return (dispatch) => {
    post('/svc/discussion/product/' + discussionObj.book, discussionObj)
      .then( function (res) {
        return dispatch( push('/discussions/product/' + discussionObj.book ) );
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}

export function editDiscussion(discussionId, body, title, currentParams){
  return (dispatch) => {
    post('/svc/discussion/edit/' + discussionId, {title: title, body: body})
      .then( res => dispatch( getDiscussions(currentParams) ))
      .catch( err => console.log('err', err));
  }
}

export function createReply(discussionId, reply, currentParams){
  return (dispatch) => {
    post('/svc/discussion/reply/' + discussionId, { body: reply })
      .then( function (res) {
        return dispatch( getDiscussions(currentParams) );
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}

export function likeDiscussion(discussionId){
  return (dispatch) => {
    put('/svc/discussion/like/' + discussionId)
      .then( function (res) {
        return;
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}

export function unlikeDiscussion(discussionId){
  return (dispatch) => {
    put('/svc/discussion/unlike/' + discussionId)
      .then( function (res) {
        return;
       }).catch( function (err) {
        return console.log('err', err);
      });
  }
}
