import React, { Component }    from 'react';
import { Link }                from 'react-router';
import { connect }             from 'react-redux';
import { bindActionCreators }  from 'redux';
import { post, get }           from '../../../svc/utils/net';
import RenewalOrderSummary     from './RenewalOrderSummary.jsx';
import SelectRenewalPlanItems  from './SelectRenewalPlanItems.jsx';
import TermsOfMembership       from '../cms/TermsOfMembership.jsx';

import AddPaymentMethod        from '../account/AddPaymentMethod.jsx';
import { getPaymentMethod, getClientToken, memberReenroll, addPaymentMethod } from '../../../modules/member_payment_method';

import { setEnrollStatusPending, clearEnrollStatus, clearEnrollError, ENROLL_STATUS_FAIL,
  ENROLL_STATUS_PENDING, getEnrollTaxRate } from '../../../modules/enrollData';


export default class Renewal extends Component{

  constructor(props){
    super(props);
    this.state = {
      rejoinError : null,
      showTerms   : false,
      showPlans   : false,
      renewalPlan : (this.props.member.subscription_history[0] !== undefined) ? this.props.member.subscription_history[0].renewal_plan : {},
      newPlan     : {},
      editPayment : false,
      promo       : null,
    };
    this.toggleShowPlans      = this.toggleShowPlans.bind(this);
    this.handleChangePlan     = this.handleChangePlan.bind(this);
    this.changePlan           = this.changePlan.bind(this);
    this.handleChangePromo    = this.handleChangePromo.bind(this);
    this.handleSetDefaultPlan = this.handleSetDefaultPlan.bind(this);
    this.getPromoPlan         = this.getPromoPlan.bind(this);
    this.braintreeObjCreate   = this.braintreeObjCreate.bind(this);
    this.toggleEditPayment    = this.toggleEditPayment.bind(this);
    this.submitFunction       = this.submitFunction.bind(this);
    this.defaultPaymentSubmit = this.defaultPaymentSubmit.bind(this);
  }

  showTerms(){ this.setState ({ showTerms   : !this.state.showTerms }); }
  toggleShowPlans(){ this.setState ({ showPlans : !this.state.showPlans }); }

  handleSetDefaultPlan(plan){  this.setState({ renewalPlan : plan }); }

  handleChangePlan( plan, evt ){ this.setState({ newPlan : plan }); }

  changePlan(evt) {
    if(evt && evt.preventDefault ) evt.preventDefault();
    this.setState({ renewalPlan : this.state.newPlan });
    this.toggleShowPlans();
  }

  handleChangePromo(event){ this.setState({ promo: event.target.value }); }

  getPromoPlan(evt){
    evt.preventDefault();
    this.setState({ promoError: null });
    get('/svc/commerce/promo/' + this.state.promo )
      .then( res => {
        if(res) this.setState({ renewalPlan : res});
        else this.setState({ promoError: "That coupon code is invalid. Please try again."});
      }).catch( err => this.setState({ promoError: "That coupon code is invalid. Please try again."}));
  }

  componentWillMount(){
    this.props.getClientToken();
    this.braintreeObjCreate();
    this.props.getPaymentMethod();
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }

  defaultPaymentSubmit(evt){
    if( !this.state.editPayment && this.props.member && this.props.member.paymentMethod )
      this.submitFunction(null, this.props.member.paymentMethod.token);
  }

  submitFunction(nonce, token){
    this.setState({
      braintreeErrors : null,
    });
    if( self.refs && self.refs.add ) (self.refs.add.getWrappedInstance()).setState({ braintreeErrors : null });

      this.props.setEnrollStatusPending();
      this.props.clearEnrollError();

    let renewalObj = {
        plan_id: this.state.renewalPlan.id,
        promo: this.state.promo
      }

      if(nonce) renewalObj.nonce = nonce;
      else renewalObj.token = token;

      this.props.memberReenroll(renewalObj);
  }

  braintreeObjCreate(){
    let self = this,
        token = self.props.member.token;
    if( !token ) return setTimeout( () => { self.braintreeObjCreate() }, 1000);
    require('braintree-web').setup(token , 'custom', {
        id: "hosted-fields-form",
        hostedFields: {
          number: { selector: "#hosted-fields-form #card-number" },
          expirationDate: { selector: "#hosted-fields-form #expiration-date" },
          cvv: {  selector: "#hosted-fields-form #cvv"  },
          postalCode: { selector: "#hosted-fields-form #postalCode" },
          styles: {
            'input': { 'font-size': '14pt' },
            'input.invalid': { 'color': 'tomato', 'background': 'rgba(255, 0, 0, 0.11)' },
            'input.valid': { 'color': 'limegreen' }
          }
        },

        onReady: (obj) => { self.braintreeObj = obj },

        onPaymentMethodReceived: (obj) => { 
          this.submitFunction(obj.nonce, null);
          self.props.addPaymentMethod({nonce: obj.nonce});
        },

        onError: (obj) => {
          if( self.refs && self.refs.add )
            (self.refs.add.getWrappedInstance()).setState({ braintreeErrors : { message: 'Please fill in all the fields.' } });
        }
      });
  }


  toggleEditPayment(){
    if(!this.state.editPayment){
      this.braintreeObjCreate();
    }
    this.setState({ editPayment: !this.state.editPayment });
  }


  render(){
    let { member } = this.props,
        badCard    = false;

    if(!member.subscription && member.subscription_history[0] !== undefined){
      if(member.subscription_history[0].will_renew) badCard = true;
    }

    let { status, error } = this.props.enrollData,
        messageHeader = "It's Time To Rejoin",
        messageBody   = "Your membership has expired. Please confirm your information below to reactivate your Book of the Month membership.",
        oEditPayment  = this.state.editPayment ? ( <AddPaymentMethod ref="add" toggleContent={this.toggleEditPayment} />) : (<div />),
        oPaymentInfo  = this.props.member && this.props.member.paymentMethod && !badCard ? (
          <div>
            <div className={this.state.editPayment ? 'hide' : 'show' }>
              {this.props.member.paymentMethod.cardType + " ending in " + this.props.member.paymentMethod.last4}
            </div>
            <div className="actionGroup">
              <button 
                className={"primary narrow alt edit" + ((this.state.editPayment) ? ' hide' : ' show')}
                onClick={this.toggleEditPayment.bind(this)}
              >Edit</button>
            </div>
            {oEditPayment}
          </div>
        ) : (<AddPaymentMethod ref="add" />);

    if(badCard){
      messageHeader ="Oh No! Your Renewal Failed",
      messageBody   ="We encountered an error when we tried to renew your membership. Please review your information and enter a valid payment method below to continue your Book of the Month membership."
    }

    if(member.subscription){
      return(
        <div className="bodyContent renewal">
          <section className="innerWrapper center">
            <h4>Your subscription is current</h4>
          </section>
        </div>
      );
    }

    return(
      <div className="bodyContent renewal">
        <section className="innerWrapper center">
          <form id='hosted-fields-form' onSubmit={this.defaultPaymentSubmit.bind(this)}> 
            <div className="enrollAccountInfo">
              <h1>{messageHeader}</h1>
              <h4 className="narrowContent">{messageBody}</h4>
              <div className="enrollAccountInfoWrapper">
                <div className="col -w65 formWrapper">
                  <h4 className="alt">Shipping Information</h4>
                  <table className="dataTable forShipping">
                    <tbody>
                      <tr>
                        <td>Address:</td>
                        <td>{this.props.address.street1}</td>
                      </tr>
                      <tr>
                        <td>Address (cont.):</td>
                        <td>{this.props.address.street2}</td>
                      </tr>
                      <tr>
                        <td>City:</td>
                        <td>{this.props.address.city}</td>
                      </tr>
                      <tr>
                        <td>Sate</td>
                        <td>{this.props.address.state}</td>
                      </tr>
                      <tr>
                        <td>Zipcode:</td>
                        <td>{this.props.address.zip}</td>
                      </tr>
                    </tbody>
                  </table>
                <h4 className="alt">Payment Information</h4>
                  {oPaymentInfo}
                </div>
                <div className="col -w35 summaryWrapper">
                  <RenewalOrderSummary
                    renewalPlan           = {this.state.renewalPlan}
                    handleChange          = {this.handleChangePromo}
                    handleSetDefaultPlan  = {this.handleSetDefaultPlan}
                    promo                 = {this.state.promo}
                    getPromoPlan          = {this.getPromoPlan}
                    promoError            = {this.state.promoError} 
                    toggleShowPlans       = {this.toggleShowPlans}
                   /> 
                </div>
              </div>
            </div>
            <h5>
              By clicking “Rejoin” you are agreeing to our <span className="link" onClick={this.showTerms.bind(this)}>Membership Terms</span>
            </h5>
            <div className={"membershipTermsBox" + ((this.state.showTerms) ? " show" : " hide")}>
              <TermsOfMembership />
            </div>
            <button className="primary fat" type="submit">{ status === ENROLL_STATUS_PENDING  ? "Pending" : "Rejoin"}</button>
          </form>
        </section>
        <div className={"modalWrapper" + ((this.state.showPlans) ? " showing" : " ")}>
          <div className={"pageModal forRenewalPlans" + ((this.state.showPlans) ? " showing" : " ")}>
            <div className="modalClose" onClick={() => this.toggleShowPlans()}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419  "/>
              </svg>
            </div>
            <section className="center">
              <h1>Select a renewal plan</h1>
              <SelectRenewalPlanItems
                handleChangePlan = {this.handleChangePlan}
                changePlan       = {this.changePlan}
                toggleShowPlans  = {this.toggleShowPlans}
              />
            </section>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state){
  return {
    member: state.member,
    address: state.member.address,
    enrollData: state.enrollData
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ memberReenroll, getPaymentMethod, getClientToken, getEnrollTaxRate, setEnrollStatusPending, clearEnrollError,
    clearEnrollStatus, addPaymentMethod }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true} )(Renewal);