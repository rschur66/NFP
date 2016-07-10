/* *******************************
View for listing current months featured 
selections and select actions. 
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { setBOTM, addToBox }  from '../../../modules/member_box';
import { bindActionCreators } from 'redux';
import { Link }               from 'react-router';
import SelectionListItem      from './SelectionListItem.jsx';
import LogoIcon               from '../../elements/LogoIcon.jsx';
import dateformat             from "dateformat";

class SelectionsListFeatured extends Component{

  constructor(props){
    super(props);
    this.state = {
      viewConf         : false,
      confBook         : {},
      showNonPickModal : ((!this.props.store_can_pick || !this.props.can_pick ) ? true : false)
    }
    this.selectBOM = this.selectBOM.bind(this);
  }

  showConf(book = {}){
    this.setState ({
      viewConf : !this.state.viewConf,
      confBook: book
    });
  }

  handleCloseNonPick(){ this.setState({ showNonPickModal : false }) }

  handleSelect(book, e){
    e.stopPropagation(); 
    e.cancelBubble = true;
    this.props.toggleModal('AddConfirmation');
    this.props.setActiveSelection(book);
  }

  selectBOM(){
    this.props.setBOTM(this.state.confBook.id);
    this.showConf();
  }

  renderBooks(){
    let { store_can_pick, can_pick, memberBox, features, box_future, subscription } = this.props,
        storeTime = new Date(this.props.storeTime),
        oActions = '',
        featuredSelectionObj = features[storeTime.getFullYear() - 2015][storeTime.getMonth()],
        featuredSelections = featuredSelectionObj.featured.map( x => this.props.products[x]);

    return featuredSelections.map((book, index)=>{
      if( !book.in_stock ){
        oActions = (
          <div className="selectBarWrapper">
            <div className="selectBar">
              <div className="bulletCircle" />
            </div>
            <button className="tertiary alt narrow disabled">Out of Stock</button>
          </div>
        );
      } else if ( can_pick && store_can_pick && book.id === memberBox[0] ){
        oActions=(
          <div className="selectBarWrapper">
            <div className="selectBar">
              <div className="logoIconDisc">
                <LogoIcon />
              </div>
               <h5>MY BOTM</h5>
            </div>
          </div>
        );
      } else if( store_can_pick && can_pick){
        oActions = (
          <div className="selectBarWrapper">
            <div className="selectBar">
              <div className="bulletCircle" />
            </div>
            <button className="primary narrow" onClick={this.showConf.bind(this, book)}>Select as my botm</button>
          </div>
        );
      } else {
        oActions = (<div /> );
      }

      return(
        <li className={"sliderItem" + ((store_can_pick) ? '' : ' noActions') } key={book.id}>
          <div>
            <SelectionListItem book={book}  defaultClick={'/my-botm/' + book.title.toLowerCase().split(' ').join('-') + '-' + book.id } />
          </div>
          { oActions }
          <h5 className="smallText tertiaryColor">
            <span className="highlightColor">{featuredSelectionObj.percents[index]}% </span> 
            of members<br />chose this book
          </h5>
        </li>
      );
    });
  }

  render(){ 

    let boxLength     = this.props.memberBox[0],
        { subscription } = this.props,
        storeTime     = new Date(this.props.storeTime),
        newMonth      = new Date(storeTime.getFullYear(), storeTime.getMonth()+1),
        confMessage   = 'You have selected '+  this.state.confBook.title +  ' as your Book of the Month. Are you sure you want to change your Book of the Month selection?',
        confActions    = (
            <div>
              <button className="primary" onClick={this.selectBOM.bind(this)}>ok</button>
              <button className="tertiary" onClick={this.showConf.bind(this)}>cancel</button>
            </div>
          ),
        rawLastDay    = '',
        rawNewLastDay = '',
        cleanDate     = '',
        cleanNewDate  = '';

    if(subscription){
      rawLastDay    = new Date((subscription.last_year + 2015), subscription.last_month+1, 0);
      rawNewLastDay = new Date((subscription.last_year + 2015), (subscription.last_month+2), 0);
      cleanDate     = dateformat( rawLastDay , "mmmm dS yyyy");
      cleanNewDate  = dateformat( rawNewLastDay , "mmmm dS yyyy");
    }

    if(subscription && (boxLength === null)){
      confMessage =(
        'You have selected '+ 
        this.state.confBook.title + 
        ' as your Book of the Month. Your expiration date will change from ' + cleanNewDate + ' back to ' + cleanDate + '.'
      );
    } 

    if(!subscription){
      confMessage = this.state.confBook.title + 'could not be selected because your membership plan failed to renew due to an invalid credit card. Please update your credit card to continue your membership';
      confActions  = (<Link to="/renewal" className="button primary">Rejoin</Link> )
    }

    return(
      <div>
        <div className = {"modalWrapper" + ((this.state.viewConf) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.showConf.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src={ this.state.confBook.img ? "http://s3.amazonaws.com/botm-media/covers/167x250/" + this.state.confBook.img : "#" } />
              <h5>{confMessage}</h5>
              <div className="confirmationActions"> {confActions} </div>
            </div>
          </div>
        </div>

        <div className = {"modalWrapper" + ((this.state.showNonPickModal) ? ' showing' : '')}>
          <div className="modal">
            <div className="modalClose" onClick={this.handleCloseNonPick.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src='/img/bom/ill-calendar.svg' className="ill"/>
              <h1>The {dateformat( storeTime, "mmmm" )} Selections are closed</h1>
              <h4>The next selections period will begin on {dateformat( newMonth, "mmmm" )} 1st, when our Judges announce 5 new titles.</h4>
              <div className="confirmationActions">
                <Link to="more-books" className="button secondary">Shop More Books</Link>
                <a className="button primary" onClick={this.handleCloseNonPick.bind(this)}>view the selections</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sliderWrapper">
          <ul className="sliderItemsContainer featuredList">
            {this.renderBooks()}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    features       : state.features,
    products       : state.products,
    can_pick       : state.member ? state.member.can_pick : false,
    store_can_pick : state.storeData.can_pick,
    subscription   : state.member.subscription,
    memberBox      : state.member ? state.member.box.books : [],
    box_future     : state.member ? state.member.box_future.books : [],
    storeTime      : state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setBOTM, addToBox }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionsListFeatured);
