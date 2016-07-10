import React, { Component } from 'react';
import {Link}               from 'react-router';
import { bindActionCreators } from 'redux';
import {connect}              from 'react-redux';
import { get } from '../../../svc/utils/net';
import { push } from 'react-router-redux'
import { setGiftRedeemStepGenre, setGiftRedeemStepConfirmation }   from '../../../modules/giftRedeemStep';
import { addGiftPlan } from '../../../modules/member';
import { setEnrollPlan, setGiftCode, setEnrollStatusPending, clearEnrollStatus, clearEnrollError, ENROLL_STATUS_FAIL,
  ENROLL_STATUS_PENDING, setGiftRedirect, setNewMember, clearNewMember } from '../../../modules/enrollData';

export default class GiftRedeem extends Component{

  constructor(props){
    super(props);
    this.state = {
      giftCode: null,
      giftSubmit: false,
      giftError: null
    };
    this.getGiftPlan = this.getGiftPlan.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }

  handleChange(evt){
    this.setState({ giftCode: evt.target.value });
  }

  getGiftPlan(evt){
    evt.preventDefault();
    if(!this.state.giftSubmit || this.props.enrollData.status !== ENROLL_STATUS_PENDING){
      this.setState({
        giftSubmit: true,
        giftError: null
      });
      get('/svc/member/gift/' + this.state.giftCode )
        .then( res => {
          if(res){
            if(!this.props.member){
              this.props.setEnrollPlan(res);
              this.props.setNewMember();
              this.props.setGiftCode(this.state.giftCode);
              this.props.setGiftRedeemStepGenre();
            } else {
              this.setState({ giftSubmit: true });
              this.props.setEnrollStatusPending();
              this.props.clearEnrollError();
              if(this.props.member){
                this.props.setEnrollPlan(res);
                this.props.clearNewMember();
                this.props.addGiftPlan(this.state.giftCode, true);
              }else
                this.props.addGiftPlan(this.state.giftCode, false);
            }
          } else {
            this.setState({ giftError: "You entered an invalid voucher code.  Please try again. If you need assistance, please call 1-888-784-2670." });
          }
        }).catch( err => {
          this.setState({ giftError: "You entered an invalid voucher code.  Please try again. If you need assistance, please call 1-888-784-2670." })
        });
    }
  }

  linkToLogin(evt){
    evt.preventDefault();
    this.props.setGiftRedirect();
    this.props.push('/login');
  }

  render(){
    let { status, error } = this.props.enrollData,
      oLogin = (<div />);
    if(!this.props.member)
      oLogin = (
        <div className="loginSection">
          <fieldset>
            <h3>If you already have an account, please login to redeem your gift.</h3>
          </fieldset>
          <button className="primary"  onClick={this.linkToLogin.bind(this)} >login </button>
        </div>
      )

    return(
      <div className="redeemGift">
        <section className="noPadding innerWrapper">
          <div className="checkerboard">
            <div className="square image" />
            <form onSubmit={this.getGiftPlan.bind(this)}>
              <div className="square content">
                <h1>Claim Your Gift</h1>
                <h6>Step 1</h6>
                <h3>Please enter your gift voucher code:</h3>
                <fieldset>
                  { this.state.giftError || error ? (<p className="error">{this.state.giftError || error }</p>) : (<div />)}
                  <input
                    type="text"
                    required
                    placeholder="voucher code"
                    onChange={this.handleChange.bind(this)}/>
                </fieldset>
                <button className="primary">{ status === ENROLL_STATUS_PENDING || this.state.giftSubmit ? "Pending" : "Continue"}</button>
                {oLogin}
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

function mapStatetoProps(state){
  return {
    'enrollData': state.enrollData,
    'member': state.member
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setGiftRedeemStepGenre, setEnrollPlan, setGiftCode, setGiftRedeemStepConfirmation, push, addGiftPlan,
    clearEnrollError, clearEnrollStatus, setEnrollStatusPending, setGiftRedirect, clearNewMember, setNewMember }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(GiftRedeem);
