import React, { Component }   from 'react';
import { memberResetPassword }        from '../../../modules/member';

export default class ForgotPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      email : '',
      formSuccess: null
    };
  }

  sendResetEmail(e){
    e.preventDefault();
    let emailVal = e.nativeEvent.target[1].value;
    memberResetPassword(emailVal);
    this.setState({ formSuccess: 'An email with a link to reset your password has been sent to your email address!' });
  }

  render(){

    return(
      <section className="bodyContent secondaryBg login">
        <div className="narrowContent">
          <div className="borderedBox">
            <h1>Forgot password?</h1>
              {(this.state.formSuccess) ? (<h5>{this.state.formSuccess}</h5>) : (<h5 id="forgotMessage">No problem! Please enter your email address and we'll email you a link to
                reset your password.</h5>) }
              <form className={this.state.formSuccess ? 'hide' : ''} onSubmit={this.sendResetEmail.bind(this)}>
                <fieldset>
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="Enter Your Email"
                  />
                </fieldset>
                <button className="primary" type="submit">Submit</button>
              </form>
          </div>
        </div>
      </section>
    );
  }
}
