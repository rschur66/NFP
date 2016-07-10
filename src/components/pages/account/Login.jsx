import React, { Component }   from 'react';
import {browserHistory, Link} from 'react-router';
import {connect}              from 'react-redux';
import { memberLogin }        from '../../../modules/member';
import { bindActionCreators } from 'redux';
import CheckMark              from '../../elements/CheckMark.jsx';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      email :   '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange( sType, event ) {
    var oUpdate      = {};
    oUpdate[ sType ] = event.target.value;
    this.setState( oUpdate );
  }

  onFormSubmit(e){
    e.preventDefault();
    this.props.memberLogin(this.state);
  }

  render(){
    let message = 'Please login using your email address.';// container for all login messages ie: error, password reset, etc.
    if (this.props.loginError) message = (<span className="error">{this.props.loginError.replace(/"/g,"")}</span>);

    return(
      <section className="bodyContent login">
        <div className="narrowContent">
          <div className="borderedBox">
            <h1>Please Login</h1>
            <h5>{message}</h5>
            <form onSubmit={this.onFormSubmit.bind( this )}>
              <fieldset>
                <input
                  type="text"
                  name="user"
                  placeholder="Email"
                  value={this.state.email}
                  required
                  onChange={this.handleChange.bind( this, 'email' )}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  required
                  onChange={this.handleChange.bind( this, 'password' )}
                  />
                </fieldset>
                <fieldset>
                <div className="col -w50">
                  <div className="checkWrapper">
                    <label><input type="checkbox" name="remember" />
                      <div>
                        <CheckMark />
                        <span className="h6">Remember me</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="col -w50 forgotPassword">
                  <Link to="forgot-password" className="h6">Forgot Password?</Link>
                </div>
              </fieldset>
              <button className="primary" type="submit">Login</button>
            </form>
            <section className="join">
              <h6>New to Book of the Month?</h6>
              <Link className="button secondary" to="enroll">Join Now</Link>
            </section>
          </div>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state){
  return { 'loginError': state.loginError };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ memberLogin }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(Login);
