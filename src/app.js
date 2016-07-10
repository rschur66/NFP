import React        from 'react';
import ReactDOM     from 'react-dom';
import reducers     from './modules';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Thunk 		from 'redux-thunk';
import CreateLogger from 'redux-logger';
import getRoutes       from './routes.js';
import { createHistory } from 'history'
import{ Router, browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'
import { get } from './svc/utils/net';
import {setLocation}         from './modules/analytics';


const initialState = window.INITIAL_STATE;
const logger = CreateLogger(); // only for debugging and testing purposes
const activityLog = store => next => action =>{
	try {
		let state = store.getState();
		get(`/svc/analytics/${encodeURIComponent(window.location.pathname)}/${encodeURIComponent(action.type)}/${state.member ? state.member.id : 0}`);
	}catch(err){
		console.error(err);
	}finally{
		return next(action);
	}
};
const errorLog = store => next => action =>{
	try {
		return next(action);
	}catch(err){
		try {
			let state = store.getState();
			get(`/svc/analytics/error/${encodeURIComponent(window.location.pathname)}/${encodeURIComponent(action.type)}/${state.member ? state.member.id : 0}/${encodeURIComponent(JSON.stringify(err))}`);
		}catch(err){
			console.error(err);
		}
		console.error(err);
	}
};
const store = applyMiddleware(
	Thunk,
	logger,
	routerMiddleware(browserHistory)
)(createStore)(reducers, initialState);

const routes = getRoutes(store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} onUpdate={() => {
    	let sPath = window.location.pathname.slice(0,12);
    	if(sPath !== '/more-books/') window.scrollTo(0, 0);
    	setLocation(store, window.location.pathname);
    }} 
    	/>
  </Provider>
  , document.getElementById('app'));
