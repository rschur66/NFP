/* *******************************
This is the logged in page for
listing all currently available books
that can be added to box for additional cost
********************************** */

import React, {Component}  from 'react';
import SelectionDetails    from './SelectionDetails.jsx';
import DetailsMobile       from './DetailsMobile.jsx';
import SelectionsList      from './SelectionsList.jsx';
import { bindActionCreators } from 'redux';
import { showBook }           from '../../../modules/active_book';
import SelectionsNav       from './SelectionsNav.jsx';
import dateformat          from "dateformat";
import { connect }         from 'react-redux';


export default class PageMoreSelections extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeModal      : '',
      pastMonthsLength : 5
    };
    this.toggleModal        = this.toggleModal.bind(this);
    this.setActiveSelection = this.setActiveSelection.bind(this);
  }

  componentWillMount(){
    let { book } = this.props.params;
    if( book ){
      let book_id = parseInt(book.substr(book.lastIndexOf('-') + 1));
      if( !isNaN(book_id) && typeof book_id === "number" && this.props.products[book_id] )
        this.props.showBook(this.props.products[book_id]);
    }
  }

  toggleModal(sType) {
    let sCurrentType = this.state.activeModal;
    if (sCurrentType.toString() === sType.toString()) sType = '';
    this.setState({
      activeModal: sType,
      activeSelection: []
    });
  }

  setActiveSelection(book){
    this.setState({
      activeSelection: book
    });
  }

  loadMore(){
    let pml  = this.state.pastMonthsLength, // current number of months showing 
        nl  = pml + 5; // add to length
    this.setState({ pastMonthsLength : nl })
  }

  renderPastMonths(){
    let pmb = [],
        pml = this.state.pastMonthsLength,
        storeTime = new Date(this.props.storeTime);
    for(var i=0; i < pml; i+=1){
      let tempStoreTime = new Date( new Date( storeTime ).setDate(1));
      let newMonth = new Date( new Date(tempStoreTime).setMonth( tempStoreTime.getMonth() -i ) );
      if( this.props.features[newMonth.getFullYear() - 2015] && this.props.features[newMonth.getFullYear() - 2015][newMonth.getMonth()] ) {
        let features = this.props.features[newMonth.getFullYear() - 2015][newMonth.getMonth()].featured;
        pmb.push(
          <section className="innerWrapper" key={dateformat( newMonth, "mmmmyy" )}  >
          <h1 className="center">{dateformat( newMonth, "mmmm" )} Selections</h1>
           <SelectionsList featured={features} />
           </section>
        );
      }
    }
    return (pmb);
  }

  render(){
    let listActions = '';
    let totalMonths = [];
    this.props.features.forEach( x => totalMonths = totalMonths.concat(x));
    totalMonths = totalMonths.filter( x => x ).length;
    if(this.state.pastMonthsLength < totalMonths){
      listActions = (
        <section>
        <a className="button primary" onClick={this.loadMore.bind(this)}>Load More</a>
        </section>
      );
    }

    return(
      <div className="bodyContent selections moreSelections center">
        <SelectionDetails />
        <DetailsMobile />
        <SelectionsNav />
        {this.renderPastMonths()}
         {listActions}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    features: state.features,
    products: state.products,
    storeTime: state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageMoreSelections);
