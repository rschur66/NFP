import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { setEmailCapture }    from '../../modules/analytics';;
import { get } from '../../svc/utils/net';

export default class EmailCapture extends Component {

  constructor(props){
    super(props);
    this.state = {
      email : '',
      emailCaptured: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.captureEmail = this.captureEmail.bind(this);
  }

  captureEmail( evt ) {
    evt.preventDefault();
    let sAddEmail = this.state.email, self = this;
    self.props.setEmailCapture();
    get( '/svc/member/lead?email=' + sAddEmail + '&type=magazine' ).then(() => {
      self.setState({emailCaptured: true});
    });
  }

  handleChange( event ){
    this.setState({ email: event.target.value });
  }

  render() {

    if(this.state.emailCaptured) return (<div className="emailCapture"><h4>Thank you for signing up for our newsletter!</h4></div>);

    return(
      <div className="emailCapture">
        <form onSubmit={this.captureEmail} className="singleInput">
          <label>Never miss out on new content, sign up for our newsletter!</label>
          <div className="fieldsWrapper">
            <input
              type        = "email"
              required    = "required"
              placeholder = "Email"
              value       = {this.state.value}
              onChange    = {this.handleChange}
            />
            <button className="primary">SIGN UP</button>
          </div>
        </form>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    'content': state.content,
    'member': state.member,
    'upgradeStatus': state.upgradeStatus,
    'path': state.analytics.location
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEmailCapture }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailCapture);