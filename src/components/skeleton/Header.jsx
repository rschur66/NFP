import React, { Component } from 'react';
import { Link }             from 'react-router';
import { connect }          from 'react-redux';
import Logo                 from '../elements/Logo.jsx';
import SecondaryNav         from './SecondaryNav.jsx';
import MainNav              from './MainNav.jsx';
import dateformat           from "dateformat";

class Header extends Component {
  constructor() {
    super();
  }

  render() {
    let { isLoggedIn, store_can_pick, next_ship_date } = this.props;
    let storeTime = new Date(this.props.storeTime);
    let selection_end = storeTime.setDate( new Date(next_ship_date).getDate() - 1 );
    let sMessage =  'Add an extra book to your next box for just $9.99!';
    if ( !isLoggedIn && store_can_pick )
      sMessage = dateformat( selection_end, "mmmm") + ' Selections have been announced! Join today and choose your first book by ' + dateformat( selection_end , "mmmm dS") + '.';
    else if (!isLoggedIn && !store_can_pick)
      sMessage = 'Join today and choose your first book on ' + dateformat( next_ship_date, "mmmm") + ' 1st!';

    return (
      <header className="header defaultBg">
        <div className="msgBar primaryBg">
          <div className="innerWrapper">
            <span className="message">{sMessage}</span>
            <SecondaryNav />
          </div>
        </div>
        <div className="innerWrapper">
          <div className="navMain">
            <Logo isLoggedIn={this.props.isLoggedIn} />
            <MainNav
              isLoggedIn={this.props.isLoggedIn}
              boxCount={this.props.boxCount}
            />
          </div>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state){
  return {
    store_can_pick: state.storeData.can_pick,
    storeData: state.storeData,
    next_ship_date: state.storeData.ship_date,
    isLoggedIn : state.member ? true : false,
    boxCount : !state.member ? 0 : ( state.storeData.can_pick && state.member.can_pick ? (state.member.box.books.filter( x => x).length + state.member.box.swag.filter( x => x).length)   :
        (state.member.box_future.books.filter( x => x ).length + state.member.box_future.swag.filter( x => x ).length) ),
    storeTime: state.storeTime
  };
}
export default connect(mapStateToProps)(Header);
