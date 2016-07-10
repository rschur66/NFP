/* *******************************
This is the logged in page for
listing and selecting a BOTM
********************************** */

import React, {Component}      from 'react';
import { connect }             from 'react-redux'; 
import { bindActionCreators } from 'redux';
import { showBook }           from '../../../modules/active_book';
import SelectionDetails        from './SelectionDetails.jsx';
import DetailsMobile           from './DetailsMobile.jsx';
import SelectionsListFeatured  from './SelectionsListFeatured.jsx';
import dateformat              from "dateformat";
import SkipMonth               from '../account/SkipMonth.jsx';
import {get}                   from '../../../svc/utils/net';

class PageMyBotm extends Component{

  constructor(props){
    super(props);
    this.state = {
    };
    this.setActiveSelection = this.setActiveSelection.bind(this);
  }

  setActiveSelection(book){
    this.setState({ activeSelection: book });
  }

  componentWillMount(){
    let { book } = this.props.params,
        storeTime = new Date(this.props.storeTime);
    if( book ){
      let book_id = parseInt(book.substr(book.lastIndexOf('-') + 1));
      if( !isNaN(book_id) && typeof book_id === "number" && this.props.products[book_id] 
        && this.props.features[storeTime.getFullYear() - 2015][storeTime.getMonth()].featured.indexOf(book_id) > -1 )
        this.props.showBook(this.props.products[book_id]);
    }
  }

  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/-2`);
    });
  }

  render(){
    let headerMessage = 'Please select your Book of the Month',
        storeTime     = new Date(this.props.storeTime),
        newMonth      = new Date(storeTime.getFullYear(), storeTime.getMonth()+1);

    if(this.props.store_can_pick && this.props.memberBox[0] === null) headerMessage = 'You skipped this month. To unskip, please select a BOTM.';
    if(!this.props.store_can_pick || !this.props.can_pick ) headerMessage = (
      dateformat( storeTime, "mmmm" ) + ' selections are closed. The next selections period will begin ' +
      dateformat( newMonth, "mmmm" ) + ' 1st.'
      );

    return(
      <div className="bodyContent myBoxPage center">
        <SelectionDetails />
        <DetailsMobile />
        <section className="center headerWrapper">
          <h1>{dateformat( storeTime, "mmmm yyyy" )} Selections</h1>
          <h4>{headerMessage}</h4>
        </section>
        <SelectionsListFeatured />
        <SkipMonth />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    memberBox      : state.member ? state.member.box.books : [],
    store_can_pick : state.storeData.can_pick,
    products       : state.products,
    features       : state.features,
    can_pick       : state.member ? state.member.can_pick : false,
    storeTime      : state.storeTime,
    experiment     : state.experiment
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageMyBotm);