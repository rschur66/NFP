/* *******************************
View for listing none current month 
selections.
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import { addToBox }           from '../../../modules/member_box';
import { bindActionCreators } from 'redux';
import { Link }               from 'react-router';
import SelectionListItem      from './SelectionListItem.jsx';
import LogoIcon               from '../../elements/LogoIcon.jsx';
import AddConfirmModal        from './AddConfirmModal.jsx'


class SelectionsList extends Component{
  constructor(props){
    super(props);
    this.state = {
      viewErrorModal : false,
      confBook : {},
    }
    this.renderBooks = this.renderBooks.bind(this);
  }

  handleSelect(book, e){
    e.stopPropagation(); 
    e.cancelBubble = true;
    this.props.toggleModal('AddConfirmation');
    this.props.setActiveSelection(book);
  }


  errorModal(book = {}, eType){
    this.setState ({
      viewErrorModal : !this.state.viewErrorModal,
      confBook: book
    });
  }

  renderBooks(){
    let { products, member, featured } = this.props,
        { box_future, box } = member || {},
        oActions = (<div />),
        self = this;
    box = box ? box.books : [],
    box_future = box_future ? box_future.books : [];
    return featured.map((book_id)=>{
      let book = products[book_id];
      if( member ){
        if( !book.in_stock ){
          oActions=(
            <div>
              <button className="tertiary narrow alt disabled" >Out of Stock</button>
            </div>
          );
        } 
        else if (book_id === box[0] ){
          oActions=(
            <div className="selectBarWrapper alt">
              <div className="logoIconDisc">
                <LogoIcon />
              </div>
              <h5>MY BOTM</h5>
            </div>
          );
        } 
        // for current box
        else if( box.indexOf(book_id) > -1 && self.props.member.can_pick ){
          oActions=(
            <div >
              <button className="primary narrow alt">
                <svg version="1.1"  x="0px" y="0px" width="14.25px" height="11.833px" viewBox="0 0 14.25 11.833" enableBackground="new 0 0 14.25 11.833">
                  <path fill="#11afe2" d="M13.801,0.364c-0.434-0.341-1.062-0.267-1.404,0.167L5.449,9.346L1.911,6.666
                  C1.469,6.332,0.842,6.418,0.51,6.859c-0.333,0.439-0.247,1.067,0.193,1.4l4.125,3.125c0.495,0.469,1.245,0.359,1.702-0.178
                  l7.437-9.438C14.309,1.335,14.234,0.707,13.801,0.364z"/>
                </svg>
                In My Box
              </button>
            </div>
          );
        } 
        // for future box
        else if( !self.props.member.can_pick && box_future.indexOf(book_id) > 0 ){
          oActions=(
            <div >
              <button className="primary narrow alt">
                <svg version="1.1"  x="0px" y="0px" width="14.25px" height="11.833px" viewBox="0 0 14.25 11.833" enableBackground="new 0 0 14.25 11.833">
                  <path fill="#11afe2" d="M13.801,0.364c-0.434-0.341-1.062-0.267-1.404,0.167L5.449,9.346L1.911,6.666
                  C1.469,6.332,0.842,6.418,0.51,6.859c-0.333,0.439-0.247,1.067,0.193,1.4l4.125,3.125c0.495,0.469,1.245,0.359,1.702-0.178
                  l7.437-9.438C14.309,1.335,14.234,0.707,13.801,0.364z"/>
                </svg>
                In My Box
              </button>
            </div>
          );
        }
        else if( member.subscription==null ) {
          oActions = (
            <div>
              <button className="button primary narrow" onClick={this.errorModal.bind(this, book, 'expiredSubscrition')} >Add For $9.99</button>
            </div>
          );
        } 

        else{
          oActions = (
            <div>
              <button className="primary narrow" onClick={() => this.props.addToBox(book_id)} >Add For $9.99</button>
            </div>
          );
        }
      }
      return(
        <li className="sliderItem" key={book.id}>
          <SelectionListItem book={book} defaultClick={'/more-books/' + book.title.toLowerCase().split(' ').join('-') + '-' + book.id} />
          { oActions }
        </li>
      );
    });
  }

  render(){ 
    let {member} = this.props,
        errorMessage = "",
        errorActions = "";

    if(member && !member.subscription){
      errorMessage = this.state.confBook.title + ' could not be selected because your membership plan failed to renew due to an invalid credit card. Please update your credit card to continue your membership';
      errorActions  = (<Link to="/renewal" className="button primary">Rejoin</Link> )
    }

    return(

      <div className="sliderWrapper selectionsList">
        <div className = {"modalWrapper" + ((this.state.viewErrorModal) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.errorModal.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src={ this.state.confBook.img ? "http://s3.amazonaws.com/botm-media/covers/167x250/" + this.state.confBook.img : "#" } />
              <h5>{errorMessage}</h5>
              <div className="confirmationActions"> {errorActions} </div>
            </div>
          </div>
        </div>

        <ul className="sliderItemsContainer">
          {this.renderBooks()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    member: state.member,
    products : state.products
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ addToBox }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionsList);
