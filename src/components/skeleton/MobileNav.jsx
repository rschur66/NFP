import React, { Component } from 'react';
import {Link}               from 'react-router';
import SecondaryNav         from './SecondaryNav.jsx';
import MainNav              from './MainNav.jsx';


const MobileNav = (props) => {

  return(
      <div className={"mobileNav" + (props.showMobileNav ? ' open' : '')}>
        <div
          className={"burger"  + (props.showMobileNav ? ' open' : '')}
          onClick = {props.toggleMobileNav}
          id="burger"
        >
          <span className="burgerLines"></span>
        </div>
        <MainNav      toggleMobileNav = {props.toggleMobileNav} />
        <SecondaryNav toggleMobileNav = {props.toggleMobileNav} />
      </div>
    );
}

export default MobileNav;
