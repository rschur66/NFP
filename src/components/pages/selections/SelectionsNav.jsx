/* *******************************
Component for showing additional 
selections navigation. 
********************************** */

import React, { Component } from 'react';
import { Link }             from 'react-router';
import LogoIcon             from '../../elements/LogoIcon.jsx';

const SelectionsNav = () =>{
  return(
    <div className="innerWrapper center">
      <div className="nav selectionsNav">
        <Link to="more-books" activeClassName="active">All botm selections</Link>
        <Link to="other-favorites" activeClassName="active">Other Favorites</Link>
        <Link to="swag" activeClassName="active">Totes & More</Link>
      </div>
    </div>
  );
};

export default SelectionsNav; 
