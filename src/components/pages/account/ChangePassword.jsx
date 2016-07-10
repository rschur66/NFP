import React, { Component }   from 'react';
import { browserHistory }   from 'react-router';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateMemberInfo }        from '../../../modules/member';

export default class ChangePassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      formError: null,
      formSuccess: null,
      member: {
        password: null,
        password2: null
      }
    };
  }

  componentWillMount() {
    this.timeouts = [];
  }

  componentWillUnmount() {
    this.timeouts.forEach(clearTimeout);
  }

  setRedirectTimeout(callback, time) {
    this.timeouts.push(setTimeout(callback, time));
  }

  validateForm(){
    let passwordNew = document.getElementById('passwordNew').value;
    let passwordConfirm = document.getElementById('passwordConfirm').value;
    let oUpdate = this.state.member;
    oUpdate.password = passwordNew;
    oUpdate.password2 = passwordConfirm;
    this.setState({ member: oUpdate });
    let member = this.state.member;
    if ( !member.password || member.password.length < 8 ) {
      this.setState({ formError:  "Your password must be at least 8 characters long." }, ()=> {
        return false;
      });
    } else if ( member.password !== member.password2 ) {
      this.setState({ formError:  "Your passwords must match." }, ()=> {
        return false;
      });
    } else {
      return true;
    }
    if ( typeof document !== 'undefined' ) {
      document.getElementById("body").scrollTop = 0;
      return false;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.updateMemberInfo(this.state.member);
      this.setState({ formError: null });
      this.setState({ formSuccess: "Password change successful." });
      this.setRedirectTimeout(()=> {
        browserHistory.push('/my-box');
      }, 3000);
    }
  }

  render(){

    return(
      <section className="bodyContent login">
        <div className="narrowContent">
          <div className="borderedBox">
            <h1>Change Password</h1>
            {(this.state.formError) ? (<h5 className="error">{this.state.formError}</h5>) : (<div />) }
            {(this.state.formSuccess && !this.state.formError) ? (<h5>{this.state.formSuccess}</h5>) : (<h5 className="changePasswordMessage">Please enter a new password below.</h5>) }
            <form onSubmit={this.handleSubmit.bind(this)}>
              <fieldset>
                <input
                  id="passwordNew"
                  type="password"
                  name="user"
                  placeholder="New Password"
                />
                <input
                  id="passwordConfirm"
                  type="password"
                  name="user"
                  placeholder="Confirm Password"
                />
              </fieldset>
              <button className="primary" type="submit">Login</button>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return { 'member': state.member }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ updateMemberInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
