import React, { Component } from 'react';

export default class Promo extends Component {
  render() {
  	return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
