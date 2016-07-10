import React, { Component } from 'react';

export default class AccountInfoFieldset extends Component{
  render(){
    let oPasswordObj = (<input
          type        = "password"
          onChange    = {this.props.handleChange.bind( this, 'password' )}
          placeholder = "Password"
          value       = {this.props.member.password} />),
        oPasswordObj2 = (<input
          type        = "password"
          onChange    = {this.props.handleChange.bind( this, 'password2' )}
          placeholder = "Confirm Password"
          value       = {this.props.member.password2} />);
    if(this.props.pwdRequired)
      oPasswordObj = (<input
          type        = "password"
          onChange    = {this.props.handleChange.bind( this, 'password' )}
          className   = {"half left" + ((this.props.missingFields && this.props.missingFields.indexOf('password') > -1) ? 'inputError' : '')}
          placeholder = "Password"
          required
          value       = {this.props.member.password} />),
        oPasswordObj2 = (<input
          type        = "password"
          required
          className   = {"half right" + ((this.props.missingFields && this.props.missingFields.indexOf('password2') > -1) ? 'inputError' : '')}
          onChange    = {this.props.handleChange.bind( this, 'password2' )}
          placeholder = "Confirm Password"
          value       = {this.props.member.password2} />);

    return(
      <fieldset>
        <input
          type        = "email"
          onChange    = {this.props.handleChange.bind( this, 'email' )}
          className   = {this.props.missingFields && this.props.missingFields.indexOf('email') > -1 ? 'inputError' : ''}
          placeholder = "Email"
          required
          value       = {this.props.member.email} />
        <input
          type        = "text"
          onChange    = {this.props.handleChange.bind( this, 'first_name' )}
          className   = {"half left" + ((this.props.missingFields && this.props.missingFields.indexOf('first_name') > -1) ? ' inputError' : '')}
          placeholder = "First Name"
          required
          value       = {this.props.member.first_name} />
        <input
          type        = "text"
          onChange    = {this.props.handleChange.bind( this, 'last_name' )}
          className   = { "half right" + ((this.props.missingFields && this.props.missingFields.indexOf('last_name') > -1) ? ' inputError' : '')}
          placeholder = "Last Name"
          required
          value       = {this.props.member.last_name} />
        <input
          type        = "text"
          onChange    = {this.props.handleChange.bind( this, 'display_name' )}
          className   = {"half left" + ((this.props.missingFields && this.props.missingFields.indexOf('display_name') > -1) ? ' inputError' : '')}
          placeholder = "Username"
          required
          value       = {this.props.member.display_name}  />
        <input
          type        = "text"
          onChange    = {this.props.handleChange.bind( this, 'phone' )}
          className   = {"half right" + ((this.props.missingFields && this.props.missingFields.indexOf('phone') > -1) ? ' inputError' : '')}
          placeholder = "Phone"
          value       = {this.props.member.phone} />
       {oPasswordObj}
       {oPasswordObj2}
      </fieldset>
    );
  }
}