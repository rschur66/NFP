//This is a container. Containers are the link between redux and react.

import React, { Component } from 'react';
import { connect } from 'react-redux'; // connects react to redux

import { selectBook} from '../actions/index';
import { bindActionCreators } from 'redux';

class BookList extends Component{

  renderList(){
    return this.props.books.map((book)=>{
      return(
          <li 
            key={book.id}
            onClick={() => this.props.selectBook(book)}
          >
            {book.bookTitle}
          </li> 
        );
    });
  }

  render(){ 
    return(
      <ul>
        {this.renderList()}
      </ul>
    );
  }
}

function mapStateToProps(state){
  // This function is the 'glue between react and redux'
  // The object that gets returned from here shows up in this component as props!
  return{
    books : state.books
  };
}


function mapDispatchToProps(dispatch){
  // Anything returned from this will be props on this component.
  // sets up actions to be called 
  // Then dispatch passes all actions to all reducers
  return bindActionCreators({ selectBook: selectBook }, dispatch)
}

/* Here, the 'connect' function takes a functions and a component and produces a container
that is 'state' aware.
 - mapDispatchToProps: makes an action creator available to be called.
*/
export default connect(mapStateToProps, mapDispatchToProps)(BookList);
