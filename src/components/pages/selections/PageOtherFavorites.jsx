/* *******************************
This is the logged in page for
additional titles available that 
were not past selections
********************************** */

import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { Link }               from 'react-router';
import { addToBox }           from '../../../modules/member_box';
import { bindActionCreators } from 'redux';
import SelectionsNav          from './SelectionsNav.jsx';
import SelectionSuggest       from './SelectionSuggest.jsx';

export default class PageOtherFavorites extends Component{

  constructor(props){
    super(props);
      this.state = {
        viewErrorModal : false,
        confBook : {},
      }
  }

  errorModal(book = {}, eType){
    this.setState ({
      viewErrorModal : !this.state.viewErrorModal,
      confBook: book
    });
  }

  renderProdList(){
    let oActionsDesktop = '', oActionsMobile = '', self = this;
    return this.props.otherFavorites.map ((oItem, i) => {

      if(self.props.member){
        if ( !oItem.in_stock ){
          oActionsDesktop = ( <button className="tertiary alt narrow disabled forDesktop">Out of Stock</button> );
          oActionsMobile = ( <button className="tertiary alt narrow disabled forMobile">Out of Stock</button> );
        } 
        // for current box
        else if( self.props.memberBox.indexOf(oItem.id) > -1 && self.props.member.can_pick){
          oActionsDesktop = ( <button className="primary narrow alt forDesktop">In My Box</button> );
          oActionsMobile = ( <button className="primary narrow alt forMobile">In My Box</button> );
        } 
        // for future box
        else if( !self.props.member.can_pick && self.props.box_future.indexOf(oItem.id) > 0 ){
          oActionsDesktop = ( <button className="primary narrow alt forDesktop">In My Box</button> );
          oActionsMobile = ( <button className="primary narrow alt forMobile">In My Box</button> );
        } 
        else if( self.props.member.subscription==null){
          oActionsDesktop = ( <button className="primary narrow forDesktop" onClick={self.errorModal.bind(this, oItem, 'expiredSubscrition')} >Add For $9.99</button> );
          oActionsMobile = ( <button className="primary narrow forMobile" onClick={self.errorModal.bind(this, oItem, 'expiredSubscrition')} >Add For $9.99</button> );
        } 
        else {
          oActionsDesktop = ( <button className="primary narrow forDesktop" onClick={() => self.props.addToBox(oItem.id)} >Add For $9.99</button> );
          oActionsMobile = ( <button className="primary narrow forMobile" onClick={() => self.props.addToBox(oItem.id)} >Add For $9.99</button> );
        }
      }

      return( 
        <li key={i} className="rowWrapper">
          <div className="col -w20">
            <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + oItem.img } />
          </div>
          {oActionsMobile}
          <div className="col -w80">
            <div className="tag">
              <h6>{oItem.subtitle}</h6>
            </div>
            <div>
              <h1 className="alt">{oItem.title}</h1>
              <h4>By {oItem.authors.map( x => this.props.authors[x].name).join(', ') }</h4>
            </div>
            <div className="blurb">
              <div dangerouslySetInnerHTML={{__html: oItem.description }} />
              {oActionsDesktop}
            </div>
          </div>
        </li>
       );
    });
  }

  render(){
    let {member} = this.props,
      errorMessage = "",
      errorActions = "";

    if(member && !member.subscription){
      errorMessage = this.state.confBook.title + 'could not be selected because your membership plan failed to renew due to an invalid credit card. Please update your credit card to continue your membership';
      errorActions  = (<Link to="/renewal" className="button primary">Rejoin</Link> )
    }

    return(
      <div className="bodyContent otherFavorites center">

        <div className = {"modalWrapper" + ((this.state.viewErrorModal) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.errorModal.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src={ this.state.confBook.img ? "http://s3.amazonaws.com/botm-media/covers/200x300/" + this.state.confBook.img : "#" } />
              <h5>{errorMessage}</h5>
              <div className="confirmationActions"> {errorActions} </div>
            </div>
          </div>
        </div>

        <SelectionsNav />

        <div className="innerWrapper selectSuggestionForm forDesktop">
          <SelectionSuggest />
        </div>

        <section className="innerWrapper center prodList">
          <ul>
            {this.renderProdList()}
          </ul>
        </section>

        <div className="innerWrapper selectSuggestionForm forMobile">
          <SelectionSuggest />
        </div>

      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    otherFavorites : state.otherFavorites.map( x => state.products[x]),
    memberBox : state.member ? state.member.box.books : [],
    authors: state.authors,
    box_future: state.member ? state.member.box_future.books : [],
    member: state.member ,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ addToBox }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageOtherFavorites);
