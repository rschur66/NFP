import React from 'react';
import { Component } from 'react';
import BookList from '../containers/books-list.js';
import BookDetail from '../containers/book-detail.js';
import SearchBar from '../containers/search_bar.js';
import WeatherList from '../containers/weather_list.js';

export default class App extends Component {
  render() {
    return (
      <div>
      {this.props.children}
        <BookList />
        <BookDetail />
        <SearchBar />
        <WeatherList />
      </div>
    );
  }
}
