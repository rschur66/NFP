import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import CheckMark              from '../../elements/CheckMark.jsx';
import LogoIcon               from '../../elements/LogoIcon.jsx';
import { Link }               from 'react-router';
import { bindActionCreators } from 'redux';
import { hideBook }           from '../../../modules/active_book';
import { setBOTM, addToBox }  from '../../../modules/member_box';

export default class AddConfirmation extends Component {

  constructor(props){
    super(props);
    this.state ={
      showContent : false,
      activeAction: ''
    }
    this.toggleActions = this.toggleActions.bind(this);
  }

  toggleActions(sType) {
    let sCurrentType = this.state.activeAction,
        {can_pick, store_can_pick} = this.props,
        isMoreBooksUrl = ( typeof window !== 'undefined' && window.location.pathname === '/more-books' );
    if (sCurrentType.toString() === sType.toString()) sType = '';
    if (sType === 'isAdded' && ( ( this.props.featuredSelection.indexOf(this.props.activeBook.id) === -1 || isMoreBooksUrl ) || (!can_pick || !store_can_pick) ))
      this.props.addToBox(this.props.activeBook.id)
    else if(sType === 'isAdded' && this.props.featuredSelection.indexOf(this.props.activeBook.id) > -1 )
      this.props.setBOTM(this.props.activeBook.id)
    if(sType === 'isAdded') sType = '';
    this.setState({ 
      activeAction: (this.props.member.subscription===null) ? 'renewal' : sType,
    });
  }

  render(){
    let { store_can_pick, can_pick, activeBook, memberBox, featuredSelection, box_future } = this.props,
        isMoreBooksUrl = ( typeof window !== 'undefined' && window.location.pathname === '/more-books' ),
        title = 'no title' ;
    if (activeBook) title = activeBook.title;
 
    let oActions='',
        BotmLink = isMoreBooksUrl ?
        (<Link to="my-botm" className="button secondary" onClick={()=> this.props.hideBook()} >Change Pick</Link>)
        : (<Link to="more-books" className="button secondary" onClick={()=> this.props.hideBook()} >Add More Books</Link>);

    const inBoxBOTM = (
      <div className="addActions isBotm">
        <div className="col -w30 ">
          <div className="logoIconDisc">
            <LogoIcon />
          </div>
          <h5>MY BOTM</h5>
        </div>

        <div className="col -w70">
          {BotmLink}
        </div>
      </div>
    );

    const inBox = (
      <div className="addActions">
         <button className="secondary alt">
          <svg version="1.1"  x="0px" y="0px" width="14.25px" height="11.833px" viewBox="0 0 14.25 11.833" enableBackground="new 0 0 14.25 11.833">
            <path fill="#333366" d="M13.801,0.364c-0.434-0.341-1.062-0.267-1.404,0.167L5.449,9.346L1.911,6.666
            C1.469,6.332,0.842,6.418,0.51,6.859c-0.333,0.439-0.247,1.067,0.193,1.4l4.125,3.125c0.495,0.469,1.245,0.359,1.702-0.178
            l7.437-9.438C14.309,1.335,14.234,0.707,13.801,0.364z"/>
          </svg>
          In My Box
        </button>
      </div>
    );

    const outOfStock = (
      <div className="addActions">
        <button className="tertiary alt disabled">Out of Stock</button>
      </div>
    );

    if(!activeBook.in_stock) {
      oActions = outOfStock;
    } else if( activeBook.id === memberBox[0] ){
      oActions = inBoxBOTM;
    } else if ( featuredSelection.indexOf(activeBook.id) > -1 && !isMoreBooksUrl && store_can_pick && can_pick ){
      switch (this.state.activeAction ){
        case 'addConfirmation' :
          oActions= ( 
            <div className="addActions addConfirmation">
              <h5>You have switched your BOTM to<em>{title}</em></h5>
              <div className="confirmationActions">
                <button className="primary" onClick={this.toggleActions.bind(this, 'isAdded')}>OK</button>
                <button className="tertiary" onClick={this.toggleActions.bind(this, '')}>Cancel</button>
              </div>
            </div>
          );
        break;

        case 'renewal' :
         oActions= (
            <div className="addActions addConfirmation">
              <h5>Your membership plan has expired.<br /><em>{title}</em> could not be added to your box.</h5>
              <div className="confirmationActions">
                <Link className="button primary" to="/renewal" onClick={this.props.clearModal.bind(this)}>Rejoin</Link>
              </div>
            </div>
          );
         break;

        default:
          oActions=(
          <div className="addActions">
            <button className="primary" onClick={this.toggleActions.bind(this, 'addConfirmation')}>Select as my Botm</button>
          </div>
        );
      }
    } else if (memberBox.indexOf(activeBook.id) > -1 || box_future.indexOf(activeBook.id) > -1 ){
      oActions =  inBox;
    } else {
       switch (this.state.activeAction ){
        case 'addConfirmation' :
          oActions= ( 
            <div className="addActions addConfirmation">
              <h5>You have added <em>{title}</em> to your box</h5>
              <div className="confirmationActions">
                <button className="primary" onClick={this.toggleActions.bind(this, 'isAdded')}>OK</button>
                <button className="tertiary" onClick={this.toggleActions.bind(this, '')}>Cancel</button>
              </div>
            </div>
          );
        break;

        case 'renewal' :
         oActions= (
            <div className="addActions addConfirmation">
              <h5>Your membership plan has expired.<br /><em>{title}</em> could not be added to your box.</h5>
              <div className="confirmationActions">
                <Link className="button primary" to="/renewal">Rejoin</Link>
              </div>
            </div>
          );
         break;

        default:
          oActions=(
          <div className="addActions">
            <button className="primary" onClick={this.toggleActions.bind(this, 'addConfirmation')}>Add For $9.99</button>
          </div>
        );
      }
    }

    return(
      <div>
        {oActions}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    featuredSelection : state.features[new Date(state.storeTime).getFullYear() - 2015][new Date(state.storeTime).getMonth()].featured,
    memberBox: state.member ? state.member.box.books : [],
    box_future: state.member ? state.member.box_future.books : [],
    can_pick : state.member ? state.member.can_pick : false,
    store_can_pick: state.storeData.can_pick,
    member: state.member
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ addToBox, setBOTM, hideBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddConfirmation);