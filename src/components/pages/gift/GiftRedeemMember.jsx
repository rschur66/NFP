import {Link}             from 'react-router';
import React, { Component } from 'react';
import {connect}              from 'react-redux';
import SocialIcons        from '../../elements/SocialIcons.jsx';

export default class GiftPurchaseConfirmation extends Component {
    render(){
        return (
            <section className="innerWrapper center success">
                <h6>Congratulations!</h6>
                <h4>You redeemed your gift. We have added {this.props.enrollData.plan.months} of months to your membership.</h4>
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

function mapStatetoProps(state){
    return {
        'enrollData': state.enrollData,
        'member': state.member
    }
}

export default connect(mapStatetoProps)(GiftPurchaseConfirmation);