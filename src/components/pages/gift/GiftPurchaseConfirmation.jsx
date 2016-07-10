import {Link}             from 'react-router';
import React, { Component } from 'react';
import SocialIcons        from '../../elements/SocialIcons.jsx';

export default class GiftPurchaseConfirmation extends Component {
	render(){
		return (
			 <section className="innerWrapper center success">
	        <h6>Success!</h6>
	        <h1>Order Confirmed</h1>
	        <h4>Your gift order has been confirmed! You will recieve an email with  the details of your order shortly.</h4>
	        <div>
	          <img src="/img/bom/ill-partyHorn.svg" />
	        </div>
	        <Link to="/" className="h6">Return Home</Link>
	        <div  className="socialWrapper center">
	          <h5>Connect with us</h5>
	          <SocialIcons />
	        </div>
	      </section>
		);
	}
}