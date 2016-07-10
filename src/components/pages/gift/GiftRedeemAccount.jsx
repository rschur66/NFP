import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import OrderSummary           from '../enroll/OrderSummary.jsx';
import FieldsetAccountInfo    from '../../elements/FieldsetAccountInfo.jsx';
import FieldsetShippingInfo   from '../../elements/FieldsetShippingInfo.jsx';
import { createMember }       from '../../../modules/member';
import TermsOfMembership      from '../cms/TermsOfMembership.jsx';
import { emailRegex }                 from '../enroll/EnrollEnterEmail.jsx';
import { displayNameRegex }   from '../../elements/CreateAccountInfo.jsx';
import { setEnrollStatusPending, clearEnrollStatus, clearEnrollError, ENROLL_STATUS_FAIL, ENROLL_STATUS_PENDING } from '../../../modules/enrollData';

const requiredFields = [ 'first_name', 'last_name', 'email', 'display_name', 'password', 'password2' ];
const requiredAddressFields = [ 'street1', 'city', 'state', 'zip'];

export default class GiftRedeemAccount extends Component{

	constructor(props){
		super(props);

		this.state = {
      showTerms: false,
      formError: null,
      formErrorArray: [],
			member: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        display_name: "",
        password: "",
        password2: ""
      },
      address: {
        street1:  "",
        street2:  "",
        city:    "",
        state:   "AA",
        zip: ""
      }
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeAccount = this.handleChangeAccount.bind(this);
		this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.validateForm = this.validateForm.bind(this);
	}

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }


  validateForm(){
    let member = this.state.member;
    this.setState({ formErrorArray: [], formError: null });
    let currentFormErrorArray = [];

    currentFormErrorArray = currentFormErrorArray.concat( requiredFields.filter( x => !this.state.member[x] || this.state.member[x].length <= 0 ));
    currentFormErrorArray = currentFormErrorArray.concat( requiredAddressFields.filter( x => !this.state.address[x] || this.state.address[x].length <= 0));

    if(currentFormErrorArray.length > 0 ) {
      this.setState({
        formError:  "Please complete the blank fields highlighted in Red below.",
        formErrorArray: currentFormErrorArray
      });
    } else if ( !emailRegex.test(member.email) ){
      this.setState({
        formError:  "Please enter a valid email address to continue",
        formErrorArray: ['email']
      });
    } else if ( !displayNameRegex.test(member.display_name) ){
      this.setState({
        formError:  "Please enter an alpha-numeric username between 3-20 characters in length.",
        formErrorArray: ['display_name']
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

	handleSubmit(evt){
    evt.preventDefault();
    if( !this.props.enrollData.status && this.validateForm() ){
      this.props.clearEnrollError();
      this.props.setEnrollStatusPending();
      let accountObj = this.state.member;
      accountObj.address = this.state.address;
      accountObj.prefs = {};
      accountObj.prefs.frequency = this.props.enrollData.frequency;
      accountObj.prefs.genres = this.props.enrollData.genres.toString();
      accountObj.plan = { gift_code: this.props.enrollData.giftCode }
      this.props.createMember(accountObj, true);
    }
	}

	handleChangeAccount( sType, event ) {
    var oUpdate      = this.state.member;
    oUpdate[ sType ] = event.target.value;
    this.setState({ member: oUpdate });
  }

  handleChangeAddress( sType, event ) {
    var oUpdate      = this.state.address;
    oUpdate[ sType ] = event.target.value;
    this.setState({ address: oUpdate });
  }

  showTerms(){ this.setState ({ showTerms : !this.state.showTerms }) }

  render(){
    return(
       <div className="bodyContentCMS center redeemGift">
            <h6>Step 4</h6>
            <h1>Almost there</h1>
            <h4>Please enter your information below to finish claiming your gift.</h4>
            <div className="planDisplayBox">
              <div className="topContent">
               <h4 className="alt">You Recieved a:</h4>
              </div>
              <div className="bottomContent">
                <h1>{this.props.enrollData.plan.name} membership</h1>
              </div>
            </div>
            <form onSubmit={this.handleSubmit.bind(this)}>
	            <div className="enrollAccountInfoWrapper">
				        <div className="formWrapper singleCol">
                  { this.props.enrollData.error || this.state.formError ?
                      (<p className="error">{this.props.enrollData.error || this.state.formError}</p> ) : (<div />)}
				            <h4 className="alt">Your Information</h4>
				            <FieldsetAccountInfo
				            	member={this.state.member}
				            	pwdRequired={true}
				            	handleChange = {this.handleChangeAccount}
                      missingFields={this.state.formErrorArray} />
				            <h4 className="alt">Shipping Information</h4>
				            <FieldsetShippingInfo
				            	address={this.state.address}
				            	handleChange = {this.handleChangeAddress}
                      missingFields={this.state.formErrorArray} />
				        </div>
				      </div>
              <div>
                <h5>
                  By clicking “Redeem Gift” you are agreeing to our <span className="link" onClick={this.showTerms.bind(this)}>Membership Terms</span>
                </h5>
                <div className={"membershipTermsBox" + ((this.state.showTerms) ? " show" : " hide")}>
                  <TermsOfMembership />
                </div>
                <div className="actionGroup">
	               <button className="primary">Redeem Gift</button>
               </div>
              </div>
            </form>
          </div>
    );
  }
}

function mapStateToProps(state){
  return { 'enrollData': state.enrollData }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ clearEnrollError, setEnrollStatusPending, clearEnrollStatus, createMember }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GiftRedeemAccount);