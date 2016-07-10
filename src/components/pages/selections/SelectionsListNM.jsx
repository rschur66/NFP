/* *******************************
Logged out view for listing current months featured 
selections without selection actions. 
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import SelectionListItem      from './SelectionListItem.jsx';

class SelectionsListNM extends Component{

  renderBooks(){
    let storeTime = new Date(this.props.storeTime);
    let featuredSelectionObj = this.props.features[storeTime.getFullYear() - 2015][storeTime.getMonth()];
    let featuredSelections = featuredSelectionObj.featured.map( x => this.props.products[x]);
    if(this.props.featuredObj)
      return this.props.featuredObj.featured.map((book_id, index)=>{
        let book = this.props.products[book_id];
        let defaultClick = (typeof window !== 'undefined' ? (window.location.pathname + (window.location.pathname.slice(-1) === '/' ? '' : '/')) : "/" ) + book.title.toLowerCase().split(' ').join('-') + '-' + book.id ;
        return(
          <li className="sliderItem" key={book.id} >
            <SelectionListItem book={book} defaultClick={defaultClick} />
            <h5 className="smallText tertiaryColor">
            <span className="highlightColor">{this.props.featuredObj.percents[index]}% </span>
            of members<br />chose this book</h5>
          </li>
        );
      });
    return featuredSelections.map((book, index) => {
      let defaultClick = (typeof window !== 'undefined' ? (window.location.pathname + (window.location.pathname.slice(-1) === '/' ? '' : '/')) : "/" ) + book.title.toLowerCase().split(' ').join('-') + '-' + book.id;
      return (
        <li className="sliderItem" key={book.id}>
          <SelectionListItem book={book} defaultClick={defaultClick} />
          <h5 className="smallText tertiaryColor">
            <span className="highlightColor">{featuredSelectionObj.percents[index]}% </span> 
            of members<br />chose this book
          </h5>
        </li>
      );
    });
  }

  render(){ 
    return(
      <div className="sliderWrapper">
        <ul className="sliderItemsContainer">
          {this.renderBooks()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    features : state.features,
    products: state.products,
    storeTime: state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ push }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionsListNM);
