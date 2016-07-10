/* *******************************
This is the logged in page for
additional add on items such as totes
, sunglasses etc.
********************************** */

import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { Link }               from 'react-router';
import { addToBox }           from '../../../modules/member_box';
import { bindActionCreators } from 'redux';
import SelectionsNav          from './SelectionsNav.jsx';
import ProductImgCarousel     from '../../elements/ProductImgCarousel.jsx';

export default class Swag extends Component{

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
    let oActionsDesktop = '', self = this;
    // let carouselImages = ['ModernLovers.jpg', 'BeforeTheFall.jpg']

console.log('future swag', self.props.box_future_swag);

    return this.props.swag.map ( (oItem, i) => {
      if(self.props.member){
        if ( !oItem.in_stock ){
          oActionsDesktop = ( <button className="tertiary alt narrow disabled">Out of Stock</button> );
        }
        // for current box
        else if( self.props.swagBox.indexOf(oItem.id) > -1 && self.props.member.can_pick ){
          oActionsDesktop = ( <button className="primary narrow alt">In My Box</button> );
        }
        // for future box
        else if( !self.props.member.can_pick && self.props.box_future_swag.indexOf(oItem.id) > -1 ){
          oActionsDesktop = ( <button className="primary narrow alt">In My Box</button> );
        }
        else if( self.props.member.subscription==null){
          oActionsDesktop = ( <button className="primary narrow" onClick={self.errorModal.bind(this, oItem, 'expiredSubscrition')} >Add to box</button> );
        } 
        else {
          oActionsDesktop = ( <button className="primary narrow" onClick={() => self.props.addToBox(oItem.id)} >Add to box</button> );
        }
      }

      return( 
        <li key={i} className="rowWrapper">
          <div className="col -w35 center">
            {/*<ProductImgCarousel carouselImages = {["//s3.amazonaws.com/botm-media/swag/" + oItem.img ]} />*/}
            <img src={"//s3.amazonaws.com/botm-media/swag/" + oItem.img } />
          </div>
          <div className="col -w65">
            <div className="tag">
              <h6>{oItem.subtitle}</h6>
            </div>
            <div>
              <h1 className="alt">{oItem.title}</h1>
            </div>
            <div className="blurb">
              <div dangerouslySetInnerHTML={{__html: oItem.description }} />
              <h5 className="priceWrapper alt">
                <span className="strikethrough">${oItem.msrp}</span>
                <span className="price">${oItem.price}</span>
              </h5>
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
      <div className="bodyContent otherFavorites swag center">

        <div className = {"modalWrapper" + ((this.state.viewErrorModal) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.errorModal.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src={ this.state.confBook.img ? "http://s3.amazonaws.com/botm-media/swag" + this.state.confBook.img : "#" } />
              <h5>{errorMessage}</h5>
              <div className="confirmationActions"> {errorActions} </div>
            </div>
          </div>
        </div>

        <SelectionsNav />
        <section className="innerWrapper center prodList">
          <ul>
            {this.renderProdList()}
          </ul>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    swag : state.swag.map( x => state.products[x]),
    memberBox : state.member ? state.member.box.books : [],
    swagBox : state.member ? state.member.box.swag : [],
    box_future: state.member ? state.member.box_future.books : [],
    box_future_swag: state.member ? state.member.box_future.swag : [],
    member: state.member ,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ addToBox }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Swag);
