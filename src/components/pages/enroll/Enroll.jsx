import React, { Component } from 'react';
import { Link }             from 'react-router';

export default class Enroll extends Component{
  render(){
    return(
      <div className="enroll">
        {this.props.children}
      </div>
    );
  }
}