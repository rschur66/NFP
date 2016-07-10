import React, { Component } from 'react';

export default class Gift extends Component{

  render(){

  return(
      <div className="bodyContent gift">
        {this.props.children}
      </div>
    );
 }
}
