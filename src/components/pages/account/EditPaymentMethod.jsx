import React, { Component }   from 'react';
import FieldsetPaymentInfo from '../../elements/FieldsetPaymentInfo.jsx';
import { editPaymentMethod }        from '../../../modules/member_payment_method.js';
import { clearBraintreeError }        from '../../../modules/braintreeError.js';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';

export default class EditPaymentMethod extends Component {

  constructor(props){
    super(props);
    this.state = {
      editPaymentSubmit: false,
      braintreeErrors: null,
      paymentMethod: props.paymentMethod ? {
        firstName: props.paymentMethod.billingAddress.firstName,
        lastName: props.paymentMethod.billingAddress.lastName,
        token: props.paymentMethod.token,
        maskedNumber: props.paymentMethod.maskedNumber,
        cvv: "",
        expirationMonth: props.paymentMethod.expirationMonth,
        expirationYear: props.paymentMethod.expirationYear,
        postalCode: props.paymentMethod.billingAddress.postalCode
      } : {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.updatePaymentMethod = this.updatePaymentMethod.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.paymentMethod != nextProps.paymentMethod)
      this.setState({
        paymentMethod: {
          firstName: nextProps.paymentMethod.billingAddress.firstName,
          lastName: nextProps.paymentMethod.billingAddress.lastName,
          token: nextProps.paymentMethod.token,
          maskedNumber: nextProps.paymentMethod.maskedNumber,
          cvv: "",
          expirationMonth: nextProps.paymentMethod.expirationMonth,
          expirationYear: nextProps.paymentMethod.expirationYear,
          postalCode: nextProps.paymentMethod.billingAddress.postalCode
        }
      });
  }

  handleChange( sType, event ) {
    var oUpdate      = this.state.paymentMethod;
    oUpdate[ sType ] = event.target.value;
    this.setState( oUpdate );
  }

  updatePaymentMethod(e){
    e.preventDefault();
    this.props.clearBraintreeError();
    this.setState({
      braintreeErrors : null,
      editPaymentSubmit: true
    });
    this.props.editPaymentMethod(this.state.paymentMethod);
  }

  render(){
    let { braintreeErrors, editPaymentSubmit, paymentMethod } = this.state;
    return (
      <div>
        <form onSubmit={this.updatePaymentMethod} >
          {(braintreeErrors && braintreeErrors.message) || this.props.braintreeError ?
          (<p className="error">{ braintreeErrors && braintreeErrors.message ? braintreeErrors.message : this.props.braintreeError }</p>) : ''}

          <FieldsetPaymentInfo
            paymentMethod={paymentMethod}
            handleChange={this.handleChange} />

          <div className="confirmationActions">
            <button className="primary">{ editPaymentSubmit ? "Pending..."  :"Update" }</button>
            { editPaymentSubmit ? (<div/>): (<a className="button secondary" onClick={this.props.toggleContent ? this.props.toggleContent.bind(this, 'hide') : this.props.showEdit.bind(this, '') }>cancel</a>) }
          </div>
        </form>
      </div>
    );
  }
}

function mapStatetoProps(state){
  return {
    'paymentMethod': state.member.paymentMethod,
    'braintreeError': state.braintreeError
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ editPaymentMethod, clearBraintreeError }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps, null, {withRef: true})(EditPaymentMethod);