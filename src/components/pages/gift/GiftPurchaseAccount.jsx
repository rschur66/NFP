import React, { Component }   from 'react';
import { Link }               from 'react-router';
import OrderSummary           from '../enroll/OrderSummary.jsx';
import CheckMark              from '../../elements/CheckMark.jsx';
import AddPaymentMethod       from '../account/AddPaymentMethod.jsx';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import dateformat             from "dateformat";
import { getPaymentMethod, getClientToken, purchaseGift } from '../../../modules/member_payment_method';
import { setEnrollStatusPending, clearEnrollStatus, clearEnrollError, ENROLL_STATUS_FAIL,
  ENROLL_STATUS_PENDING, getEnrollTaxRate } from '../../../modules/enrollData';
import { emailRegex }                 from '../enroll/EnrollEnterEmail.jsx';
import { setGiftConfirmationTracking } from '../../../modules/analytics';

const requiredFields = [ 'giver_first_name', 'giver_last_name', 'giver_email', 'recipient_name', 'recipient_email', 'message', 'delivery_method' ];

export default class GiftPurchaseAccount extends Component{

    constructor(props){
    super(props);
    let storeTime = new Date(props.storeTime);
    this.state ={
      showTerms   : false,
      editPayment : false,
      gift_form:{
        giver_first_name: props.member ? props.member.first_name : "",
        giver_last_name: props.member ? props.member.last_name : "",
        giver_email: props.member ? props.member.email : "",
        recipient_name:  "",
        recipient_email:  "",
        message:    "",
        delivery_method: null,
        delivery_month: dateformat( storeTime, "mmmm"),
        delivery_day: storeTime.getDate() ,
        delivery_year: storeTime.getFullYear(),
        zipcode: ""
      },
      formError: null,
      formErrorArray: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.braintreeObjCreate = this.braintreeObjCreate.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.toggleEditPayment = this.toggleEditPayment.bind(this);
    this.submitFunction = this.submitFunction.bind(this);
    this.defaultPaymentSubmit = this.defaultPaymentSubmit.bind(this);
  }

  componentWillMount(){
    this.props.getClientToken();
    this.braintreeObjCreate();
    if( this.props.member ) this.props.getPaymentMethod();
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }

  defaultPaymentSubmit(evt){
    if( !this.state.editPayment && this.props.member && this.props.member.paymentMethod )
      this.submitFunction(null, this.props.member.paymentMethod.token, this.props.member.paymentMethod.billingAddress.postalCode);
  }

  submitFunction(nonce, token, zip){
    this.setState({
      braintreeErrors : null,
      formError: null,
      formErrorArray: []
    });
    if( self.refs && self.refs.add ) (self.refs.add.getWrappedInstance()).setState({ braintreeErrors : null });
    if( !this.props.enrollData.status && this.validateForm() ){

      this.props.setEnrollStatusPending();
      this.props.clearEnrollError();

      let giftObj = {
        plan_id : this.props.enrollData.plan.id,
        giver_email : this.state.gift_form.giver_email,
        recipient_name : this.state.gift_form.recipient_name,
        recipient_email: this.state.gift_form.recipient_email,
        message: this.state.gift_form.message,
        zipcode: zip,
        delivery_method: this.state.gift_form.delivery_method,
        giver_name : this.state.gift_form.giver_first_name + " " + this.state.gift_form.giver_last_name,
        delivery_date : new Date( this.state.gift_form.delivery_month + " " + this.state.gift_form.delivery_day + " " + this.state.gift_form.delivery_year)
      }

      if(nonce) giftObj.nonce = nonce;
      else giftObj.token = token;

      this.props.purchaseGift(giftObj);
      this.props.setGiftConfirmationTracking(this.props.enrollData.plan.name);
    }
  }

  braintreeObjCreate(){
    let self = this,
        token = self.props.member ? self.props.member.token : self.props.enrollData.token;
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

        onPaymentMethodReceived: (obj) => { this.submitFunction(obj.nonce, null, this.state.gift_form.zipcode) },
        onError: (obj) => {
          if( self.refs && self.refs.add )
            (self.refs.add.getWrappedInstance()).setState({ braintreeErrors : { message: 'Please fill in all the fields.' } });
        }
      });
  }

  validateForm(){
    let gift_form = this.state.gift_form,
        storeTime = new Date(this.props.storeTime),
        currentFormErrorArray = [];
    currentFormErrorArray = currentFormErrorArray.concat( requiredFields.filter( x => !gift_form[x] || gift_form[x].length <= 0 ));
    let deliveryDate = new Date( gift_form.delivery_month + " " + gift_form.delivery_day + " " + gift_form.delivery_year);
    deliveryDate.setHours(23);
    deliveryDate.setMinutes(59);
    deliveryDate.setSeconds(59);

    if( (!this.props.member || !this.props.member.paymentMethod || this.state.editPayment) && (!gift_form.zipcode || gift_form.zipcode.length <= 0 ))
      currentFormErrorArray = currentFormErrorArray.concat('zipcode');

    if(currentFormErrorArray.length > 0 ) {
      this.setState({
        formError:  "Please complete the blank fields highlighted in Red below.",
        formErrorArray: currentFormErrorArray
      });
    } else if ( !emailRegex.test(gift_form.recipient_email) ){
      this.setState({
        formError:  "Please enter a valid email address for the recipient email to continue",
        formErrorArray: ['recipient_email']
      });
    } else if ( !emailRegex.test(gift_form.giver_email) ){
      this.setState({
        formError:  "Please enter a valid email address for the giver email to continue",
        formErrorArray: ['giver_email']
      });
    } else if( !gift_form.delivery_method ) this.setState({ formError: "You must choose a delivery method" });
    else if( deliveryDate <= storeTime && gift_form.delivery_method === "email"){
      this.setState({
        formError: "Please select a delivery date of today or in the future.",
        formErrorArray: ['email_delivery_date']
      });
    }
    else return true;
    if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
    return false;
  }


  handleChange( sType, event ) {
    var oUpdate      = this.state.gift_form;
    oUpdate[ sType ] = event.target.value;
    if( sType === 'zipcode' ) this.props.getEnrollTaxRate(event.target.value);
    this.setState({ gift_form: oUpdate });
  }

  handleChangeMethod(value, evt){
    if(evt.target.checked){
      var oUpdate      = this.state.gift_form;
      oUpdate.delivery_method = value;
      this.setState({ gift_form: oUpdate });
    }
  }

  toggleEditPayment(event){
    event.preventDefault();
    if(!this.state.editPayment){
      let oUpdate = this.state.gift_form;
      oUpdate.zipcode = "";
      this.setState({ gift_form: oUpdate });
      this.braintreeObjCreate();
    } else if(this.props.member && this.props.member.paymentMethod ) {
      let oUpdate = this.state.gift_form;
      oUpdate.zipcode = this.props.member.paymentMethod.billingAddress.postalCode;
      this.setState({ gift_form: oUpdate });
    }
    this.setState({ editPayment: !this.state.editPayment });
  }

  render(){
    let { status, error } = this.props.enrollData,
        storeTime = new Date(this.props.storeTime);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September","November", "December"];
    const days = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16,17, 18, 19, 20, 21,22, 23,24,25,26,27,28,29,30, 31];
    const years = [ storeTime.getFullYear(), storeTime.getFullYear() + 1];

    let oEditPayment = this.state.editPayment ? ( <AddPaymentMethod ref="add" toggleContent={this.toggleEditPayment} />) : (<div />),
        oPaymentInfo = this.props.member && this.props.member.paymentMethod ? (
        <div>
          <div className={this.state.editPayment ? 'hide' : 'show' }>
            {this.props.member.paymentMethod.cardType + " ending in " + this.props.member.paymentMethod.last4}
          </div>
          <button 
            className={"primary narrow alt edit" + ((this.state.editPayment) ? ' hide' : ' show')}
            onClick={this.toggleEditPayment.bind(this)}
          >Edit</button>
          {oEditPayment}
        </div>
    ) : (<AddPaymentMethod ref="add" />);

    let oZipInput = !this.props.member || !this.props.member.paymentMethod || this.state.editPayment ? (
      <input
        type          = "text"
        required
        onChange      = {this.handleChange.bind( this, 'zipcode' )}
        value         = {this.state.gift_form.zipcode}
        className     = {this.state.formErrorArray && this.state.formErrorArray.indexOf('zipcode') > -1 ? 'inputError' : ''}
        placeholder   = "Billing Zipcode"  /> ) : (<div />);

    return(
      <div>
        <section className="center">
          <h6>Step 2</h6>
          <h1>Purchase Your Gift</h1>
          <h4>Please enter the information below to complete your gift purchase.</h4>
        </section>
        <section className="center secondaryBg sendMethod">
          <h3>How would you like to send your gift?</h3>
          <ul className="customBigSelects giftFormat">
            <li>
              <label>
                <input type="radio" name="sendMethod" value="email" onChange={this.handleChangeMethod.bind(this, 'email')} />
                  <div className={ "topContent" + (this.state.formErrorArray && this.state.formErrorArray.indexOf('delivery_method') > -1 ? ' inputError' : '') } >
                    <CheckMark />
                    <svg className="ill" version="1.1" x="0px" y="0px" width="100px" height="70px" viewBox="-33 -18 100 70" enableBackground="new -33 -18 100 70">
                      <path fill="#C3C3C9" d="M59.288,50h-83.533c-4.251,0-7.709-3.457-7.709-7.707v-52.585c0-4.25,3.458-7.708,7.709-7.708h83.533
                      C63.54-18,67-14.542,67-10.292v52.585C67,46.543,63.54,50,59.288,50z M-24.245-16c-3.148,0-5.709,2.561-5.709,5.708v52.585
                      c0,3.146,2.561,5.707,5.709,5.707h83.533C62.438,48,65,45.439,65,42.293v-52.585C65-13.439,62.438-16,59.288-16H-24.245z"/>
                      <path fill="#C3C3C9" d="M17.479,29.051c-2.509,0-5.018-0.953-6.927-2.861l-35.4-35.411l1.414-1.414l35.4,35.411
                      c3.04,3.037,7.989,3.039,11.029-0.002l35.463-35.459l1.414,1.414L24.409,26.189C22.498,28.098,19.989,29.051,17.479,29.051z"/>
                      <rect x="27.511" y="28.324" transform="matrix(0.7072 0.707 -0.707 0.7072 34.2152 -23.9766)" fill="#C3C3C9" width="37.093" height="2"/>
                      <rect x="-12.045" y="10.896" transform="matrix(0.7071 0.7071 -0.7071 0.7071 17.5554 16.4218)" fill="#C3C3C9" width="2" height="37.013"/>
                    </svg>
                    <h6>email</h6>
                  </div>
              </label>
            </li>
            <li>
              <label>
                <input type="radio" name="sendMethod" value="voucher" onChange={this.handleChangeMethod.bind(this, 'voucher')} />
                  <div className={ "topContent" + (this.state.formErrorArray && this.state.formErrorArray.indexOf('delivery_method') > -1 ? ' inputError' : '') } >
                    <CheckMark />
                      <svg className="ill" version="1.1" x="0px" y="0px" width="100px" height="70px" viewBox="-33 -18 100 70" enableBackground="new -33 -18 100 70">
                        <path fill="#C3C3C9" d="M66.51,36.922H48.213v-2H64.51V7.088c0-3.376-2.747-6.123-6.123-6.123h-82.414
                          c-3.376,0-6.123,2.747-6.123,6.123v27.834h16.317v2h-18.317V7.088c0-4.479,3.644-8.123,8.123-8.123h82.414
                          c4.479,0,8.123,3.644,8.123,8.123V36.922z"/>
                        <path fill="#C3C3C9" d="M49.15,1.007h-63.983v-17.273H49.15V1.007z M-12.833-0.993H47.15v-13.273h-59.983V-0.993z"/>
                        <path fill="#C3C3C9" d="M49.142,50.496h-63.994V24.601c0.024-1.782,1.481-3.222,3.248-3.222h57.496c1.792,0,3.25,1.457,3.25,3.249
                          V50.496z M-12.853,48.496h59.994V24.628c0-0.688-0.561-1.249-1.25-1.249h-57.475l0,0c-0.701,0-1.26,0.555-1.27,1.235V48.496z"/>
                        <path fill="#C3C3C9" d="M-23.294,10.856c-1.955,0-3.544-1.59-3.544-3.544s1.59-3.545,3.544-3.545c1.953,0,3.542,1.59,3.542,3.545
                          S-21.341,10.856-23.294,10.856z M-23.294,5.767c-0.852,0-1.544,0.693-1.544,1.545c0,0.852,0.693,1.544,1.544,1.544
                          c0.851,0,1.542-0.693,1.542-1.544C-21.751,6.46-22.443,5.767-23.294,5.767z"/>
                        <path fill="#C3C3C9" d="M-13.862,10.856c-1.954,0-3.544-1.59-3.544-3.544s1.59-3.545,3.544-3.545c1.954,0,3.543,1.59,3.543,3.545
                          S-11.909,10.856-13.862,10.856z M-13.862,5.767c-0.852,0-1.544,0.693-1.544,1.545c0,0.852,0.692,1.544,1.544,1.544
                          c0.851,0,1.543-0.693,1.543-1.544C-12.319,6.46-13.012,5.767-13.862,5.767z"/>
                        <rect x="-7.178" y="30.101" fill="#C3C3C9" width="47.395" height="2"/>
                        <rect x="-7.178" y="39.744" fill="#C3C3C9" width="47.395" height="2"/>
                      </svg>
                    <h6>printed voucher</h6>
                  </div>
              </label>
            </li>
          </ul>
        </section>
        <section className="innerWrapper center">
          <form id='hosted-fields-form' onSubmit={this.defaultPaymentSubmit.bind(this)}>
              <div className="enrollAccountInfo">
                <div className="enrollAccountInfoWrapper">
                  <div className="col -w65 formWrapper">
                    <fieldset>
                      <h4 className="alt">Your Information</h4>
                      {  this.state.formError || error ? (<p className="error">{ this.state.formError|| error }</p>) : (<div />)}
                      
                      <input 
                        type="email" 
                        required 
                        placeholder   = "Email"
                        value         = {this.state.gift_form.giver_email}
                        className     = {this.state.formErrorArray && this.state.formErrorArray.indexOf('giver_email') > -1 ? 'inputError' : ''}
                        onChange      = {this.handleChange.bind( this, 'giver_email' )}/>

                      <input 
                        type="text" 
                        required 
                        placeholder ="First Name"
                        value       = {this.state.gift_form.giver_first_name}
                        className   = {"half left" + ((this.state.formErrorArray && this.state.formErrorArray.indexOf('giver_first_name') > -1) ? 'inputError' : '')}
                        onChange    = {this.handleChange.bind( this, 'giver_first_name' )} />
                      <input 
                        type="text" 
                        required 
                        placeholder = "Last Name"
                        value       = {this.state.gift_form.giver_last_name}
                        className   = {"half right" + ((this.state.formErrorArray && this.state.formErrorArray.indexOf('giver_last_name') > -1) ? 'inputError' : '')}
                        onChange    = {this.handleChange.bind( this, 'giver_last_name' )} />
                      

                      {oZipInput}

                    </fieldset>

                    <fieldset>
                      <h4 className="alt">Gift Information</h4>
                      <input
                        type          = "text"
                        required
                        onChange      = {this.handleChange.bind( this, 'recipient_name' )}
                        value         = {this.state.gift_form.recipient_name}
                        className     = {this.state.formErrorArray && this.state.formErrorArray.indexOf('recipient_name') > -1 ? 'inputError' : ''}
                        placeholder   = "Recipient Name"  />

                      <input
                        type          = "text"
                        required
                        value         = {this.state.gift_form.recipient_email}
                        onChange      = {this.handleChange.bind( this, 'recipient_email' )}
                        className     = {this.state.formErrorArray && this.state.formErrorArray.indexOf('recipient_email') > -1 ? 'inputError' : ''}
                        placeholder   = "Recipient Email"  />

                      <div className={((this.state.gift_form.delivery_method ==='email')? 'show' :'hide')} >
                      <h6>EMAIL DELIVERY DATE</h6>

                        <div className   = {this.state.formErrorArray && this.state.formErrorArray.indexOf('email_delivery_date') > -1 ? 'inputError selectWrapper col -w33' : 'selectWrapper col -w33'}>
                          <select
                            value         = {this.state.gift_form.delivery_month}
                            onChange     = {this.handleChange.bind( this, 'delivery_month' )}
                          >
                            { months.map( x => (<option key={x} value={x}>{x}</option>) )}
                          </select>
                        </div>

                        <div className   = {this.state.formErrorArray && this.state.formErrorArray.indexOf('email_delivery_date') > -1 ? 'inputError selectWrapper col -w33' : 'selectWrapper col -w33'}>
                          <select
                            value         = {this.state.gift_form.delivery_day}
                            onChange     = {this.handleChange.bind( this, 'delivery_day' )}
                          >
                            { days.map( x => (<option key={x} value={x}>{x}</option>) )}
                          </select>
                        </div>

                        <div className   = {this.state.formErrorArray && this.state.formErrorArray.indexOf('email_delivery_date') > -1 ? 'inputError selectWrapper col -w33' : 'selectWrapper col -w33'}>
                          <select
                            value         = {this.state.gift_form.delivery_year}
                            onChange     = {this.handleChange.bind( this, 'delivery_year' )}
                          >
                            { years.map( x => (<option key={x} value={x}>{x}</option>) )}
                          </select>
                        </div>
                        </div>
                        <h6>Gift Message</h6>
                        <textarea
                          placeholder="Write a gift message here..."
                          maxLength="100" rows="5" cols="50"
                          value         = {this.state.gift_form.message}
                          className   = {this.state.formErrorArray && this.state.formErrorArray.indexOf('message') > -1 ? 'inputError' : ''}
                          draggable="false"
                          onChange={this.handleChange.bind(this, 'message')}
                           />
                    </fieldset>
                    <h4 className="alt">Payment Information</h4>
                    {oPaymentInfo}
                  </div>
                  <div className="col -w35 summaryWrapper">
                    <OrderSummary handleSetActiveStep={this.props.handleSetActiveStep}/>
                  </div>
                </div>
              </div>
              <button className="primary" >{ status === ENROLL_STATUS_PENDING  ? "Pending" : "Purchase Gift"}</button>
          </form>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    'member': state.member,
    'enrollData': state.enrollData,
    'storeTime': state.storeTime
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ getPaymentMethod, getClientToken, setEnrollStatusPending, clearEnrollError,
    clearEnrollStatus, purchaseGift, setGiftConfirmationTracking, getEnrollTaxRate }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GiftPurchaseAccount);