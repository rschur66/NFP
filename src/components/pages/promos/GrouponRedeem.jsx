import React, { Component }   from 'react';
import {Link}                 from 'react-router';
import { bindActionCreators } from 'redux';
import {connect}              from 'react-redux';
import { get }                from '../../../svc/utils/net';
import { setGrouponRedeemStepAccount }  from '../../../modules/grouponRedeemStep';
import { setEnrollPlan, setGrouponCode, clearEnrollStatus, ENROLL_STATUS_FAIL, ENROLL_STATUS_PENDING, setNewMember,
  clearNewMember } from '../../../modules/enrollData';

export default class GrouponRedeem extends Component{

  constructor(props){
    super(props);
    this.state = {
      grouponCode: null,
      grouponSubmit: false,
      grouponError: null
    };
    this.getGiftPlan = this.getGiftPlan.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.enrollData.status === ENROLL_STATUS_FAIL && this.props.enrollData.status === ENROLL_STATUS_PENDING )
      this.props.clearEnrollStatus();
  }

  handleChange(evt){
    this.setState({ grouponCode: evt.target.value });
  }

  getGiftPlan(evt){
    evt.preventDefault();
    if(!this.state.grouponSubmit || this.props.enrollData.status !== ENROLL_STATUS_PENDING){
      this.setState({
        grouponSubmit: true,
        grouponError: null
      });
      get('/svc/member/groupon/' + this.state.grouponCode )
        .then( res => {
          if(res){
            this.props.setEnrollPlan(res);
            this.props.setNewMember();
            this.props.setGrouponCode(this.state.grouponCode);
            this.props.setGrouponRedeemStepAccount();
          } else this.setState({ grouponError: "You entered an invalid groupon voucher code.  Please try again. If you need assistance, please call 1-888-784-2670." });
        }).catch( err => this.setState({ grouponError: "You entered an invalid groupon voucher code.  Please try again. If you need assistance, please call 1-888-784-2670." }));
    }
  }

  render(){
    let { status, error } = this.props.enrollData;

    return(
      <div className="bodyContent redeemGroupon">
        <section className="noPadding">
          <div className="checkerboard">
            <div className="square image">
              <img src="/img/bom/promos/groupon.gif" alt="Welcome Groupon Members"/>
            </div>
            <form onSubmit={this.getGiftPlan.bind(this)}>
              <div className="square content">
                <h6>Step 1</h6>
                <h1>Please enter your groupon code</h1>
                
                <fieldset>
                  { this.state.grouponError || error ? (<p className="error">{this.state.grouponError || error }</p>) : (<div />)}
                  <input
                    type="text"
                    required
                    placeholder="Groupon code"
                    onChange={this.handleChange.bind(this)}/>
                </fieldset>

                <button className="primary">{ status === ENROLL_STATUS_PENDING || this.state.grouponSubmit ? "Pending" : "Continue"}</button>
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
  return bindActionCreators({ setEnrollPlan, setGrouponCode, setGrouponRedeemStepAccount, clearEnrollStatus, clearNewMember, setNewMember }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(GrouponRedeem);
