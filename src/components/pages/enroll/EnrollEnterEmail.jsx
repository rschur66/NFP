import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { setEnrollStepPlan }  from '../../../modules/enrollStep';
import { setEnrollEmail }     from '../../../modules/enrollData';
import { setEmailCapture }    from '../../../modules/analytics';
import { bindActionCreators } from 'redux';
import { get }                from '../../../svc/utils/net';
import TOSContent             from '../cms/TOSContent.jsx';

export const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

export default class EnrollEnterEmail extends Component{
  constructor(props){
    super(props)
    this.state = {
      showTerms : false,
      email: null, 
      error: null
    }
    this.handleShowTerms = this.handleShowTerms.bind(this);
    this.validEmail      = this.validEmail.bind(this);
  }

  handleShowTerms(){ this.setState ({ showTerms : !this.state.showTerms }); }

  handleChange(evt){
    this.setState({ email: evt.target.value });
  }

  sendEmailToLead(evt){
    evt.preventDefault();
    this.setState({ error: null });
    if( !this.state.email || !this.validEmail() ) return this.setState({ error: "Please enter a valid email address to continue."});
    this.props.setEnrollEmail(this.state.email);
    get( '/svc/member/lead?email=' + this.state.email )
      .then( (res) => {
        if( typeof document !== undefined ){
          let pixel = document.createElement("img");
          pixel.src = "http://p.liadm.com/p?c=18200";
          window.document.body.appendChild(pixel);
        }
      })
    this.props.setEnrollStepPlan();
    this.props.setEmailCapture();
  }

  validEmail(){
    if( !emailRegex.test(this.state.email) ) return false;
    return true;
  }

  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/3`);
    });
  }

  render(){

    let termsOfService = (<div />);
    if (this.state.showTerms){
      termsOfService =(
        <div className = "modalWrapper showing">
          <div className="termsOfService modal">
            <div className="modalClose" onClick={this.handleShowTerms.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419 "/>
              </svg>
            </div>
            <TOSContent />
          </div>
        </div>
      );
    }

    return (
        <div className="bodyContentCMS enterEmailWrapper center">
          <h6>Step 3</h6>
          <form onSubmit={this.sendEmailToLead.bind(this)}>
            <div className="enterEmail">
              <h1>Please enter your email to continue.</h1>
              {this.state.error ? (<p className="error">{this.state.error}</p>) : <div />}
              <input type="email" placeholder="Email" required value={this.state.email}
                     onChange={this.handleChange.bind(this)}/>
            </div>
            <button className="primary fat">Continue</button>
          </form>
          <div className="termsLink smallText">
            By clicking Continue, you agree to our <a onClick={this.handleShowTerms.bind(this)}>Terms of Service</a>
          </div>
          {termsOfService}
        </div>
    );
  }
}

function mapStateToProps(state){
  return { experiment: state.experiment };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepPlan, setEmailCapture, setEnrollEmail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollEnterEmail);