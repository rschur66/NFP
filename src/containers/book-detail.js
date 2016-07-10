import React, { Component } from 'react';
import { connect } from 'react-redux';

class BookDetail extends Component {
  render(){
    if (!this.props.book){ //if prop is not yet available
      return <div>Select a book</div>
    }
    return(
      <div>
        {this.props.book.bookTitle}
        {this.props.book.pages}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    book : state.activeBook
  };
}

export default connect(mapStateToProps)(BookDetail);
