import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { setEnrollStepPlan }  from '../../../modules/enrollStep';
import { bindActionCreators } from 'redux';
import { Link }               from 'react-router';
import CheckMark              from '../../elements/CheckMark.jsx';

/*
@TODO: Find a better way.
Right now this is used for both enroll and gift purchase and the 
summary info is toggeled to display different info based on a class:
 className="forEnroll" /  className="forGift"
*/
export default class OrderSummary extends Component {
  constructor(props){
    super(props);
    this.state = {
      showContent : false,
      showTerms   : false
    }
  }

  showTerms(){
    this.setState ({ showTerms : !this.state.showTerms });
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  render(){
    let {plan, membershipPlans, tax_rate, handleChange, getPromoPlan, promoError } = this.props,
      promoCodeInput = (<div />),
      tax = Math.round((plan.price * tax_rate) * 100) / 100,
      total =  Math.round((tax + plan.price) * 100) / 100,
      plusMinus = (this.state.showContent) ? '-' : '+';

    if(handleChange && getPromoPlan)
      promoCodeInput = (
        <div className="invitationCode">
          <div className="expanderWrapper" onClick={this.toggleContent.bind(this)}>
            <h5>Promo Code</h5>
            <div className="expander">{plusMinus}</div>
          </div>
          <div className={"toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
            {promoError ? (<p className="error">{promoError}</p>) : (<div />)}
            <input
              type="text"
              placeholder="enter code"
              onChange={handleChange.bind(this)}
              value={this.props.promo} />
            <button className="primary fat" onClick={getPromoPlan.bind(this)}>submit</button>
          </div>
        </div>
      );
    
    return(
        <div className="orderSummary">
          <div className="planHeader">
            <Link className="smallText forGift" to="/gift">change</Link>
            <a className="smallText forEnroll" onClick={() => this.props.setEnrollStepPlan()}>change</a>
            <h4 className="alt forEnroll">Your Plan</h4>
            <h4 className="alt forGift">Gift Plan</h4>
          </div>
          
          <div className="planDisplayBox">
            <div className="topContent">
             <h4 className="alt">{plan.name}</h4>
             <h4 className="alt forEnroll">MEMBERSHIP</h4>
             <h4 className="alt forGift">GIFT MEMBERSHIP</h4>
             <CheckMark />
            </div>
          </div>

          {promoCodeInput}

          <h4 className="alt">Order Summary</h4>
          <table className="dataTable">
            <tbody>
              <tr>
                <td className="smallText">
                <span className="forEnroll">{plan.name} MEMBERSHIP</span>
                <span className="forGift">{plan.name} GIFT MEMBERSHIP</span>
                </td>
                <td className="h6">${plan.price}</td>
              </tr>
              <tr>
                <td className="smallText">Shipping</td>
                <td className="h6">FREE</td>
              </tr>
              <tr>
                <td className="smallText">Tax</td>
                <td className="h6">${tax}</td>
              </tr>
              <tr className="separator">
                <td className="smallText">Total</td>
                <td className="h4 alt">${total}</td>
              </tr>
            </tbody>
          </table>
          <h5 className="planDescription forEnroll">{plan.description}.</h5>
        </div>
      );
  }
}

function mapStateToProps(state){
  return {
    membershipPlans : state.storeData.plans,
    plan: state.enrollData.plan,
    tax_rate: state.enrollData.tax_rate
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);