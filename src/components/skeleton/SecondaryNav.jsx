import React, { Component} from 'react';
import { Link }            from 'react-router';
import { connect }         from 'react-redux';
import GiftIcon            from '../elements/GiftIcon.jsx';
import HeartIcon            from '../elements/HeartIcon.jsx';

class SecondaryNav extends Component{

  render(){

    let oNav = (
      <div>
        <ul className="groupOne">
          <li><Link to="/discussions" onClick={this.props.toggleMobileNav}>Discussions</Link></li>
        </ul>
        <ul className="groupTwo">
          <li className="forMobile mobileButton"><Link to="/enroll" onClick={this.props.toggleMobileNav}>Join Now</Link></li>
          <li className="mobileButton"><Link to="/gift" onClick={this.props.toggleMobileNav}>Gift <GiftIcon /></Link></li>
          <li className="mobileButton"><Link to="/login" onClick={this.props.toggleMobileNav}>Login</Link></li>
        </ul>
      </div>
    );

    if (this.props.isLoggedIn){
      oNav = (
        <ul>
          <li className="mobileButton"> <Link to="/gift" onClick={this.props.toggleMobileNav}><GiftIcon /> Give A Gift</Link></li>
          <li className="mobileButton"> <Link to="/account/refer-a-friend" onClick={this.props.toggleMobileNav}><HeartIcon /> Refer A Friend</Link></li>
        </ul> );
    }

    return(
      <div className="navSecondary">
        {oNav}
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoggedIn : state.member ? true : false
  };
}

export default connect(mapStateToProps, null)(SecondaryNav);
