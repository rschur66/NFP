import React, { Component }           from 'react';
import { Link }                       from 'react-router';
import { connect }                    from 'react-redux';
import AddPaymentMethod               from '../pages/account/AddPaymentMethod.jsx';
import { setEnrollStepConfirmation }  from '../../modules/enrollStep';
import { bindActionCreators }         from 'redux';
import TermsOfMembership              from '../pages/cms/TermsOfMembership.jsx';
import OrderSummary                   from '../pages/enroll/OrderSummary.jsx';
import FieldsetAccountInfo            from './FieldsetAccountInfo.jsx';
import FieldsetShippingInfo           from './FieldsetShippingInfo.jsx';
import { getClientToken }             from '../../modules/member_payment_method';
import { get }                        from '../../svc/utils/net';
import { createMember }               from '../../modules/member';
import { emailRegex }                 from '../pages/enroll/EnrollEnterEmail.jsx';
import { setEnrollPlan, setEnrollCoupon,  setEnrollStatusPending, clearEnrollStatus, clearEnrollError, getEnrollTaxRate,
  ENROLL_STATUS_FAIL, ENROLL_STATUS_PENDING } from '../../modules/enrollData';

export const displayNameRegex = /^[A-Z0-9]{3,63}$/i;
const requiredFields = [ 'first_name', 'last_name', 'email', 'display_name', 'password', 'password2' ];
const requiredAddressFields = [ 'street1', 'city', 'state', 'zip'];

export default class CreateAccountInfo extends Component{

  constructor(props){
    super(props);
    this.state = {
      showTerms   : false,
      braintreeErrors: null,
      formError: null,
      formErrorArray: [],
      promo: null,
      promoError: null,
      member: ( props.member ? ({
        first_name: props.member.firstName,
        last_name: props.member.lastName,
        email: props.member.email,
        phone: props.member.phone,
        display_name: props.member.display_name,
        password: props.member.password,
        password2: props.member.password2
      }) :
      ({
        first_name: "",
        last_name: "",
        email: props.enrollData.email ? props.enrollData.email : "",
        phone: "",
        display_name: "",
        password: "",
        password2: ""
      }) ),
      address: ( props.member && props.member.address ? ({
        street1:  props.member.address.street1,
        street2:  props.member.address.street2,
        city:    props.member.address.city,
        state:   props.member.address.props,
        zip: props.member.address.zip
      }) :
      ({
        street1:  "",
        street2:  "",
        city:    "",
        state:   "AL",
        zip: ""
      }) )
    };
    this.braintreeObjCreate = this.braintreeObjCreate.bind(this);
    this.handleChangeAccount = this.handleChangeAccount.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePromo = this.handleChangePromo.bind(this);
    this.getPromoPlan = this.getPromoPlan.bind(this);
  }

  componentWillMount(){ this.props.getClientToken() }
  componentDidMount(){ this.braintreeObjCreate() }

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }

  showTerms(){ this.setState ({ showTerms : !this.state.showTerms }) }

  handleChangeAccount( sType, event ) {
    var oUpdate      = this.state.member;
    oUpdate[ sType ] = event.target.value;
    this.setState({ member: oUpdate });
  }

  handleChangeAddress( sType, event ) {
    var oUpdate      = this.state.address;
    oUpdate[ sType ] = event.target.value;
    if( sType === 'zip' ) this.props.getEnrollTaxRate(event.target.value);
    this.setState({ address: oUpdate });
  }

  handleChangePromo(event){ this.setState({ promo: event.target.value }); }

  getPromoPlan(evt){
    evt.preventDefault();
    this.setState({ promoError: null });
    let promo = this.state.promo;
    get('/svc/commerce/promo/' + promo )
      .then( res => {
        if(res){
          this.props.setEnrollCoupon(promo);
          this.props.setEnrollPlan(res);
        } else this.setState({ promoError: "That coupon code is invalid. Please try again."});
      }).catch( err => this.setState({ promoError: err.message}) );
  }

  validateForm(){
    let member = this.state.member;
    let currentFormErrorArray = [];

    currentFormErrorArray = currentFormErrorArray.concat( requiredFields.filter( x => !this.state.member[x] || this.state.member[x].length <= 0 ));
    currentFormErrorArray = currentFormErrorArray.concat( requiredAddressFields.filter( x => !this.state.address[x] || this.state.address[x].length <= 0));

    if(currentFormErrorArray.length > 0 ) {
      this.setState({
        formError:  "Please complete the blank fields highlighted in Red below.",
        formErrorArray: currentFormErrorArray
      });
    } else if ( !displayNameRegex.test(member.display_name) ){
      this.setState({
        formError:  "Please enter an alpha-numeric username between 3-20 characters in length.",
        formErrorArray: ['display_name']
      });
    } else if ( !emailRegex.test(member.email) ){
      this.setState({
        formError:  "Please enter a valid email address to continue",
        formErrorArray: ['email']
      });
    } else if( !member.password || member.password.length < 4 || member.password.length > 20 ){
      this.setState({
        formError:  "Please enter an alpha-numeric password between 4-20 characters in length.",
        formErrorArray: ['password']
      });
    } else if( member.password !== member.password2 ){
      this.setState({
        formError:  "Your password does not match. Please try again.",
        formErrorArray: ['password2']
      });
    } else return true;
    if( typeof document !== 'undefined' ) document.getElementById("body").scrollTop = 0;
    return false;
  }

  braintreeObjCreate(){
    let self = this;
    if( !self.props.enrollData.token ) return setTimeout( () => { self.braintreeObjCreate() }, 1000);
    require('braintree-web').setup(self.props.enrollData.token , 'custom', {
        id: "hosted-fields-form",
        hostedFields: {
          number: { selector: "#hosted-fields-form #card-number" },
          expirationDate: { selector: "#hosted-fields-form #expiration-date" },
          cvv: {  selector: "#hosted-fields-form #cvv"  },
          postalCode: { selector: "#hosted-fields-form #postalCode" },
          styles: {
            'input': { 'font-size': '14pt' },
            'input.invalid': { 'color': 'tomato', 'background-color': 'rgba(255, 0, 0, 0.11)' },
            'input.valid': { 'color': 'limegreen' }
          }
        },
        onReady: (obj) => { self.braintreeObj = obj },
        onPaymentMethodReceived: (obj) => {
          self.setState({
            braintreeErrors : null,
            formError: null,
            formErrorArray: []
          });
          if( !self.props.enrollData.status && self.validateForm() ){
            self.props.setEnrollStatusPending();
            self.props.clearEnrollError();

            let accountObj = self.state.member;
            accountObj.prefs = {};
            accountObj.address = self.state.address;
            accountObj.plan = { nonce: obj.nonce };
            if(self.props.isGroupon) accountObj.plan.groupon_code = this.props.enrollData.grouponCode;
            else accountObj.plan.id = self.props.enrollData.plan.id;
            if(self.state.promo && !self.props.isGroupon) accountObj.plan.promo = self.state.promo;
            accountObj.prefs.frequency = self.props.enrollData.frequency;
            accountObj.prefs.genres = self.props.enrollData.genres.toString();
            self.props.createMember(accountObj, false, self.props.isGroupon);
          }
        },
        onError: (obj) => { 
          self.setState({ braintreeErrors : { message: 'Please complete the blank fields highlighted in Red below.' } })
          if (document){
            let el = document.getElementById("billingInfo");
            document.body.scrollTop = (el.offsetTop + 90);
          }
        }
      });
  }

  render(){
    let { braintreeErrors, member, address, showTerms, formError } = this.state;
    let { status, error } = this.props.enrollData;
    let xOrderSummary = this.props.isGroupon ? (<OrderSummary />) : (
      <OrderSummary
        handleChange={this.handleChangePromo}
        promo={this.state.promo}
        getPromoPlan={this.getPromoPlan}
        promoError={this.state.promoError} />
    );

    return(
      <div className="enroll">
          <form id="hosted-fields-form">
              <div className="enrollAccountInfoWrapper">
                <div className={"col -w65 formWrapper"}>
                    {( error || formError ? (<p className="error">{ error || formError }</p>) : (<div />))}
                    <h4 className="alt">Your Information</h4>
                    <FieldsetAccountInfo 
                      member={member}
                      pwdRequired={true}
                      handleChange={this.handleChangeAccount}
                      missingFields={this.state.formErrorArray} />
                    <h4 className="alt">Shipping Information</h4>
                    <FieldsetShippingInfo
                      address={address}
                      handleChange = {this.handleChangeAddress}
                      missingFields={this.state.formErrorArray} />
                    <h4 className="alt" id="billingInfo">Billing Information</h4>
                    { (braintreeErrors && braintreeErrors.message) ? (<p className="error">{braintreeErrors.message}</p>) : ''}
                    <AddPaymentMethod ref="add" />

                </div>
                <div className="col -w35 summaryWrapper">
                  {xOrderSummary}
                </div>
                <h5>
                  By clicking “Join” you are agreeing to our <span className="link" onClick={this.showTerms.bind(this)}>Membership Terms</span>
                </h5>
                <div className={"membershipTermsBox" + ((showTerms) ? " show" : " hide")}>
                  <TermsOfMembership />
                </div>
              </div>
              <button className="primary fat" type="submit" >{status === ENROLL_STATUS_PENDING ? "Pending...": "Join"}</button>
          </form>
      </div>
    );
  }
}


function mapStateToProps(state){
  return {
    'member': state.member,
    'enrollData': state.enrollData
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepConfirmation, getClientToken, createMember, setEnrollPlan,
    setEnrollStatusPending, clearEnrollStatus, clearEnrollError, getEnrollTaxRate, setEnrollCoupon }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountInfo);