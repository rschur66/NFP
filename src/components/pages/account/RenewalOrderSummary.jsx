import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link }               from 'react-router';
import { changeRenewalPlan }  from '../../../modules/member';
import CheckMark              from '../../elements/CheckMark.jsx';
import SelectRenewalPlanItems from './SelectRenewalPlanItems.jsx';


export default class RenewalOrderSummary extends Component {
  constructor(props){
    super(props);
    this.state = {
      showContent : false,
      error       : null,
      renewalPlan : this.props.renewalPlan,
    }
  }

  componentWillReceiveProps(nextProps){
    if( this.props.renewalPlan != nextProps.renewalPlan )
      this.setState({renewalPlan : nextProps.renewalPlan });
  }

  toggleContent(){ this.setState ({ showContent : !this.state.showContent }); }

  render(){
    let {member, tax_rate, handleChange, getPromoPlan, promoError, storePlans } = this.props,
      promoCodeInput  = (<div />),
      plan            = this.state.renewalPlan,
      planId          = plan.id,
      planIndex       = storePlans.map((e) => { return e.id; }).indexOf(planId),
      defaultPlan     = storePlans[1];// default to 3 month plan

    if(planIndex === -1){
     plan = defaultPlan;// check to see if renewal plan is available else set to default plan.
     this.props.handleSetDefaultPlan(plan);
   }

    let tax       = (Math.round((plan.price * tax_rate) * 100) / 100),
        total     = parseFloat((Math.round((tax + plan.price) * 100) / 100)).toFixed(2),
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
            <a className="smallText" onClick={() => this.props.toggleShowPlans()}>change</a>
            <h4 className="alt">Your Plan</h4>
          </div>
          <div className="planDisplayBox">
            <div className="topContent">
             <h4 className="alt">{plan.name}</h4>
             <h4 className="alt">MEMBERSHIP</h4>
             <CheckMark />
            </div>
          </div>
          {/*promoCodeInput*/}
          <h4 className="alt">Order Summary</h4>
          <table className="dataTable">
            <tbody>
              <tr>
                <td className="smallText">
                {plan.name} MEMBERSHIP
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
    member    : state.member,
    tax_rate  : state.member? state.member.tax_rate : 0,
    storePlans: state.storeData.renewal_plans,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ changeRenewalPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RenewalOrderSummary);