import React, { Component } from 'react';

export default class FieldsetPayment extends Component{

  render(){
    return(
      <fieldset>
        <input
          type="text"
          placeholder="First Name"
          value       = {this.props.paymentMethod.firstName}
          onChange     = {this.props.handleChange.bind( this, 'firstName' )} />
        <input
          type="text"
          placeholder="Last Name"
          value       = {this.props.paymentMethod.lastName}
          onChange     = {this.props.handleChange.bind( this, 'lastName' )} />

        <input
          readOnly
          type="text"
          placeholder="Card Number"
          value={this.props.paymentMethod.maskedNumber} />

          
        <div className="selectWrapper col -w50">
          <select
            name="creditCard_expMonth"
            id="creditCard_expMonth"
            required
            value        = {this.props.paymentMethod.expirationMonth}
            onChange     = {this.props.handleChange.bind( this, 'expirationMonth' )} >
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
        <div className="selectWrapper col -w50">
          <select 
            name="creditCard_expYear"
            id="creditCard_expYear"
            required 
            value        = {this.props.paymentMethod.expirationYear}
            onChange     = {this.props.handleChange.bind( this, 'expirationYear' )} >
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>
              <option value="2033">2033</option>
              <option value="2034">2034</option>
              <option value="2035">2035</option>
          </select>
        </div>
        <div className="col -w50">
          <input 
            type="text"  
            placeholder="cvv (required)"
            required 
            value        = {this.props.paymentMethod.cvv}
            onChange     = {this.props.handleChange.bind( this, 'cvv' )} />
        </div>
        <div className="col -w50">
          <input type="text"  
            placeholder="billing zip" 
            className="col -w50"
            required 
            value        = {this.props.paymentMethod.postalCode}
            onChange     = {this.props.handleChange.bind( this, 'postalCode' )} />
        </div>
      </fieldset>
      );
  }
}