import React, { Component }                 from 'react';
import AddPaymentMethod                     from './AddPaymentMethod.jsx';
import {connect}                            from 'react-redux';
import EditPaymentMethod                    from './EditPaymentMethod.jsx';
import { get }                              from '../../../svc/utils/net';
import { bindActionCreators }               from 'redux';
import { clearBraintreeError }              from '../../../modules/braintreeError.js';
import { getPaymentMethod, getClientToken } from '../../../modules/member_payment_method';
import { Link }                             from 'react-router';

export default class PaymentInfo extends Component {

  constructor(props){
    super(props);
    this.state = { showContent: this.props.paymentMethod ? 'default' : 'none'};
    this.toggleContent = this.toggleContent.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.braintreeError && !this.props.braintreeError ){
      if ( this.state.showContent === 'edit' &&  (this.refs.edit.getWrappedInstance()).state.editPaymentSubmit ){
        (this.refs.edit.getWrappedInstance()).setState({ editPaymentSubmit: false });
      } else if ( this.state.showContent === 'add' && (this.refs.add.getWrappedInstance()).state.addPaymentSubmit ) {
        (this.refs.add.getWrappedInstance()).setState({ addPaymentSubmit: false });
      }
    } else if( nextProps.paymentMethod != this.props.paymentMethod){
      if(this.state.showContent === 'none') this.setState({ showContent: 'default' });
      else if ( this.state.showContent === 'edit' &&  (this.refs.edit.getWrappedInstance()).state.editPaymentSubmit ){
        (this.refs.edit.getWrappedInstance()).setState({ editPaymentSubmit: false });
        this.setState({ showContent: 'default' });
      } else if ( this.state.showContent === 'add' && (this.refs.add.getWrappedInstance()).state.addPaymentSubmit ) {
        (this.refs.add.getWrappedInstance()).setState({ addPaymentSubmit: false });
        this.setState({ showContent: 'default' });
      }
    }
  }

  componentWillMount(){
    this.props.getClientToken();
    this.props.getPaymentMethod();
  }

  toggleContent(content, evt){
    if( evt && evt.preventDefault ) evt.preventDefault();
    if( content === 'hide' ) {
      if( this.props.paymentMethod ) content = 'default';
      else if(content === 'hide' && !this.props.paymentMethod ) content = 'add';
      this.props.clearBraintreeError();
    }
    this.setState ({ showContent : content });
  }

  render(){
    let paymentMethod = this.props.paymentMethod,
        showContent = this.state.showContent,
        paymentInfoContent = null,
        showRenewalMessage = false,
        renewalMessage = (<div />);

    // for failed renewals
    if(!this.props.member.subscription && this.props.member.subscription_history[0] !==undefined){
      if (this.props.member.subscription_history[0].will_renew){
        if (this.props.location === '/account/payment') showContent ='expired';
        if (this.props.location === '/renewal') showContent ='add';
      }else{ 
        renewalMessage = <h5 className="error">Your membership has expired. It’s time to rejoin Book of the Month!</h5>;
        showRenewalMessage = true;
      }
    }

    switch (showContent) {
      case 'default':
        if( !paymentMethod ) paymentInfoContent = (<h5>Loading...</h5>);
        else paymentInfoContent = (
          <div className="content toggledContent show" >
            <table className="dataTable">
                <tbody>
                  <tr>
                    <td>Name on card:</td>
                    <td>{(paymentMethod.billingAddress.firstName || "") + " " + (paymentMethod.billingAddress.lastName || "") }</td>
                  </tr>
                  <tr>
                    <td>Card Number:</td>
                    <td>{paymentMethod.cardType ? paymentMethod.cardType + " ending in " + paymentMethod.last4 : "paypal" }</td>
                  </tr>
                  <tr>
                    <td>Exp. Date</td>
                    <td>{paymentMethod.expirationDate}</td>
                  </tr>
                  <tr>
                    <td>CVV</td>
                    <td>&bull;&bull;&bull;&bull;</td>
                  </tr>
                  <tr>
                    <td>Billing Zip:</td>
                    <td>{paymentMethod.billingAddress.postalCode}</td>
                  </tr>
                </tbody>
            </table>
            {renewalMessage}
            <div className="confirmationActions">
              <Link className={"button primary narrow" + ((showRenewalMessage)? ' show': ' hide')} to="/renewal" >Rejoin</Link>
              <button className={"primary narrow" + ((showRenewalMessage)? ' hide': ' show')} onClick={this.toggleContent.bind(this, 'edit')} >Edit</button>
              <button className={"secondary narrow" + ((showRenewalMessage)? ' hide': ' show')} onClick={this.toggleContent.bind(this, 'add')} >Add Payment Method</button>
            </div>
          </div>
        );
      break;

      case 'add':
        paymentInfoContent = (
          <div className="content toggledContent show" >
            <form id='hosted-fields-form'>
              <AddPaymentMethod toggleContent={this.toggleContent} ref="add" submitButton={true} />
            </form>
          </div>
        );
      break;

      case 'edit':
        paymentInfoContent = (
          <div className="content toggledContent show" >
            <EditPaymentMethod toggleContent={this.toggleContent} ref="edit" />
          </div>
        );
      break;

      case 'expired':
        paymentInfoContent = (
          <div className="content toggledContent show" >
            <h5 className="error">
              We encountered an error when we tried to renew your membership. Your account is now inactive. 
            </h5>
            <div className="confirmationActions">
              <Link className="button primary narrow" to="/renewal" >Fix It</Link>
            </div>
          </div>
        );
      break;

      default: // none
        paymentInfoContent = (
          <div className="content toggledContent show" >
            <h5>Please add payment method to be able to add a subscription.</h5>
            <div className="confirmationActions">
              <button className="primary narrow" onClick={this.toggleContent.bind(this, 'add')} >Add Payment Method</button>
            </div>
          </div>
        )
    }

    return(
      <section className="paymentInfo">
        <h1 className="sectionHeader">Payment Info</h1> 
        {paymentInfoContent}
      </section>
    );
  }
}

function mapStatetoProps(state){
  return {
    paymentMethod: state.member.paymentMethod,
    braintreeError: state.braintreeError,
    member: state.member,
    location: state.analytics.location,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ getPaymentMethod, getClientToken, clearBraintreeError }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(PaymentInfo);