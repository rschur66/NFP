// Action Creators => these call reducers in reducers/index.js

import axios from 'axios'; // for ajax requests

const API_Key = '0ec8781a541b821063204c3bbe0dc6d5';
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_Key}`;

export const FETCH_WEATHER = 'FETCH_WEATHER'; // create a const to aviod typo errors when calling

export function fetchWeather(city){ 
  const url= `${ROOT_URL}&q=${city},us`;
  const request = axios.get(url); // this will return a promise

  return{
    type: FETCH_WEATHER,
    payload: request /* Since 'request is a promise, 
    the middleware 'Redux-Promise' intercepts the action request and stops it 
    until the promise resolves then sends to the action with normal data to the reducers.*/
  }; 
}



export function selectBook(book){ 
  // SelectBook is an action creator so it needs to return an action.  
  // includes an object with a type property a payload
  return {
    type: 'BOOK_SELECTED',
    payload : book //optional - provides additional data for action
  };
}
