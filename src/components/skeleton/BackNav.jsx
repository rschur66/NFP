import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import { bindActionCreators } from 'redux';
import {Link}                 from 'react-router';
import { hideBook }           from '../../modules/active_book';
import { hideJudge}           from '../../modules/active_judge';
import SecondaryNav           from './SecondaryNav.jsx';
import MainNav                from './MainNav.jsx';

class BackNav extends Component{

  closeEverything(){
    this.props.hideBook();
    this.props.hideJudge();
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
  }

  render(){
    return(
      <div className="backArrow -forDetails" onClick={() => this.closeEverything()}>
        <svg version="1.1"  x="0px" y="0px" width="13px" height="22px" viewBox="0 0 13 22" enableBackground="new 0 0 13 22">
          <polygon fill="#231F20" points="11.361,21.764 0.604,11.006 11.297,0.313 12.711,1.728 3.432,11.006 12.775,20.35 "/>
        </svg>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    // activeBook        : state.activeBook,
    // activeBookAuthors : state.activeBook ? state.activeBook.authors.map( x => state.authors[x] ) : [],
    // activeBookJudge   : state.activeBook ? state.judges[state.activeBook.judge_id] : {},
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ hideBook, hideJudge }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BackNav);