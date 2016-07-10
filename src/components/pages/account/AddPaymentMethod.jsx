import React, {Component}     from 'react';
import {addPaymentMethod}     from '../../../modules/member_payment_method';
import {connect}              from 'react-redux';
import {bindActionCreators}   from 'redux';
import {clearBraintreeError}  from '../../../modules/braintreeError.js';

export default class AddPaymentMethod extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addPaymentSubmit: false,
      braintreeErrors: null,
      braintreeErrorObj: null,
      braintreeObj: null
    };
    this.braintreeObjCreate = this.braintreeObjCreate.bind(this);
    this.braintreeObjDestroy = this.braintreeObjDestroy.bind(this);
  }

  componentDidMount() {
    if (this.props.submitButton) this.braintreeObjCreate();
  }

  braintreeObjCreate() {
    let self = this;
    if (!self.props.token) {
      return setTimeout(function () {
        self.braintreeObjCreate();
      }, 1000);
    }
    require('braintree-web').setup(self.props.token, 'custom', {
      id: "hosted-fields-form",
      hostedFields: {
        number: {selector: "#hosted-fields-form #card-number"},
        expirationDate: {selector: "#hosted-fields-form #expiration-date"},
        cvv: {selector: "#hosted-fields-form #cvv"},
        postalCode: {selector: "#hosted-fields-form #postalCode"},
        styles: {
          'input': {'font-size': '14pt'},
          'input.invalid': {'color': 'tomato'},
          'input.valid': {'color': 'limegreen'}
        },
      },
      onReady: function (obj) {
        self.braintreeObj = obj;
      },
      onPaymentMethodReceived: function (obj) {
        if (self.state.addPaymentSubmit === false) {
          self.props.clearBraintreeError();
          self.setState({
            braintreeErrors: null,
            addPaymentSubmit: true
          });

          self.props.addPaymentMethod({nonce: obj.nonce});
        }
      },
      onError: function (obj) {
        self.setState({braintreeErrors: {message: 'Please fill in all the fields.'}});
      }
    });
  }

  braintreeObjDestroy() {
    if (this.braintreeObj !== null && this.braintreeObj !== undefined) {
      this.braintreeObj.teardown(function () {
        this.braintreeObj = null;
      });
      delete this.braintreeObj;
    }
  }

  render() {
    let braintreeErrors = this.state.braintreeErrors,
      addPaymentSubmit = this.state.addPaymentSubmit,
      cancelButton = (<div />),
      submitButton = (<div />);

    if (this.props.submitButton) submitButton = (<button className="button primary"
                                                         type="submit">{ addPaymentSubmit ? "Pending..." : "Add Payment Method" }</button>);
    if (this.props.toggleContent && !addPaymentSubmit)
      cancelButton = (<a className="button secondary" onClick={this.props.toggleContent.bind(this, 'hide')}>cancel</a>);
    else if (this.props.showEdit && !addPaymentSubmit)
      cancelButton = (<a className="button secondary" onClick={this.props.showEdit.bind(this, '')}>cancel</a>);

    return (
      <div>
        {(braintreeErrors && braintreeErrors.message) || this.props.braintreeError ?
          (<p
            className="error" id="btError">{ braintreeErrors && braintreeErrors.message ? braintreeErrors.message : this.props.braintreeError }</p>) : ''}
        <fieldset>
          <label>Credit Card Number</label>
          <div id="card-number" className="hostedFieldInput"/>

          <div className="third">
            <label>CVV</label>
            <div id="cvv" className="hostedFieldInput"/>
          </div>

          <div className="third middle">
            <label>Expiration Date (MM/YYYY)</label>
            <div id="expiration-date" className="hostedFieldInput"/>
          </div>

          <div className="third">
            <label>Zipcode</label>
            <div id="postalCode" className="hostedFieldInput"/>
          </div>

          <div className="confirmationActions">
            {submitButton}
            {cancelButton}
          </div>
        </fieldset>
      </div>
    );
  }
}


function mapStatetoProps(state) {
  return {
    token: state.member ? state.member.token : null,
    braintreeError: state.braintreeError,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addPaymentMethod, clearBraintreeError}, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps, null, {withRef: true})(AddPaymentMethod);
