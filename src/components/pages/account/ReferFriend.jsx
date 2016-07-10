import React, {Component}  from 'react';
import {connect}          from 'react-redux';
import { createMemberReferral }        from '../../../modules/member';

export default class ReferFriend extends Component {

  constructor(props){
    super(props);
    this.state = {
      formSuccess: null,
      name : '',
      email: '',
      referralMessage:
      props.member.first_name + ` has invited you to Book of the Month!

As a BOTM member, you'll choose from 5 new literary gems each month - powerful,  ` +
      `immersive books that you might not have heard of otherwise. ` +
      `We'll deliver your choice right to your doorstep. Use invitation code REFER50 for 50% off a 3-month membership. ` +
      `Join today and discover a better way to read.`
    };
    this.handleChange = this.handleChange.bind(this);
    this.inviteFriend = this.inviteFriend.bind(this);
  }

  handleChange( sType, event ) {
    let oUpdate = {};
    oUpdate[ sType ] = event.target.value;
    this.setState( oUpdate );
  }

  inviteFriend(evt){
    evt.preventDefault();
    createMemberReferral(this.state);
    let oUpdate = {
      name: '',
      email: '',
      formSuccess: 'Your invitation has been sent. Feel free to send some more!'
    };
    this.setState(oUpdate);
  }


  render(){
    return(
      <section className="referFriend">
        <h1 className="sectionHeader">Refer A Friend</h1>
        <h5>
          Invite your friends to join Book of the Month and you’ll earn one free extra book for each
          friend who joins. In order to receive credit, your friend must be a new Book of the Month
          member, click on your referral link, and complete the enrollment process.
          Free Trial memberships do not count as qualified enrollments.
        </h5>
        <div className="group">
          <h4>INVITE FRIENDS BY EMAIL</h4>
          <form onSubmit={this.inviteFriend.bind(this)}>
            <fieldset>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={this.state.name}
                required = "required"
                onChange={this.handleChange.bind( this, 'name' )}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                required = "required"
                onChange={this.handleChange.bind( this, 'email' )}
              />
              <label className="textareaLabel">Email Message</label>
              <textarea
                rows={6}
                required = "required"
                placeholder ={this.state.referralMessage}
                value={this.state.referralMessage}
                onChange={this.handleChange.bind( this, 'referralMessage' )}
              >
              </textarea>
            </fieldset>
            {(this.state.formSuccess) ? (<div className="formSuccess h5 alt">{this.state.formSuccess}<br /></div>) : ('') }
            <button className="primary">Send</button>
          </form>
        </div>
        <div className="group">
          <h4>INVITE FRIENDS ON FACEBOOK</h4>
          <span className="helperText">Copy and paste this link on Facebook!</span>
          <div className="borderedBox selectable overflowAuto" >
            {"https://www.bookofthemonth.com/referCode/?referCode=" + this.props.member.refer_code }
          </div>
        </div>
        <div className="group referrals">
          <h4>YOUR REFERRALS</h4>
          <h5>To use a credit, simply add any book from “The Store” to your box, and it will ship for free!</h5>
          <h6>Friends You've Enrolled</h6>
          <h5>None of your referrals have joined yet. Invite more friends to earn free extra books.</h5>
          <h6>Free Extra Book Credits: {this.props.member.credits}</h6>
        </div>
      </section>
    );
  }
}


function mapStateToProps(state){
    return {
      social: state.member.social,
      member: state.member
    };
}

export default connect(mapStateToProps)(ReferFriend);
