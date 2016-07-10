import {combineReducers} from 'redux';
import BooksReducer from './reducer_books';
import ActiveBook from './reducer_active_book';
import WeatherReducer from './reducer_weather';

const rootReducer = combineReducers({
  // This is the appilcation state: (note that this is NOT component state.)
  books: BooksReducer,
  activeBook : ActiveBook,
  weather: WeatherReducer
});

export default rootReducer; 