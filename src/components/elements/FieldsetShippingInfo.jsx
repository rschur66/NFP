import React, { Component } from 'react';

export default class ShippingInfoFieldset extends Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
        <fieldset>
          <input
            type        = "text"
            onChange    = {this.props.handleChange.bind( this, 'street1' )}
            placeholder = "Shipping Street"
            className   = {"half" + ((this.props.missingFields && this.props.missingFields.indexOf('street1') > -1 )? 'inputError' : '')}
            value       = {this.props.address.street1}
            required    = "required" />
          <input
            type        = "text"
            onChange    = {this.props.handleChange.bind( this, 'street2' )}
            className   = {"half right" + ((this.props.missingFields && this.props.missingFields.indexOf('street2') > -1) ? 'inputError' : '')}
            placeholder = "Shipping Street (cont.)"
            value       = {this.props.address.street2} />
          <input
            type         = "text"
            onChange     = {this.props.handleChange.bind( this, 'city' )}
            className    = {"third" + ((this.props.missingFields && this.props.missingFields.indexOf('city') > -1) ? 'inputError' : '')}
            placeholder  = "Shipping City"
            value        = {this.props.address.city}
            required     = "required" />
          <div className="selectWrapper third middle">
            <select
              onChange  = {this.props.handleChange.bind( this, 'state' )}
              className = {this.props.missingFields && this.props.missingFields.indexOf('state') > -1 ? 'inputError' : ''}
              value     = {this.props.address.state}
              required  = "required" >
              <option value="AK">AK - Alaska</option>
              <option value="AL">AL - Alabama</option>
              <option value="AR">AR - Arkansas</option>
              <option value="AZ">AZ - Arizona</option>
              <option value="CA">CA - California</option>
              <option value="CO">CO - Colorado</option>
              <option value="CT">CT - Connecticut</option>
              <option value="DC">DC - District of Columbia</option>
              <option value="DE">DE - Delaware</option>
              <option value="FL">FL - Florida</option>
              <option value="GA">GA - Georgia</option>
              <option value="HI">HI - Hawaii</option>
              <option value="IA">IA - Iowa</option>
              <option value="ID">ID - Idaho</option>
              <option value="IL">IL - Illinois</option>
              <option value="IN">IN - Indiana</option>
              <option value="KS">KS - Kansas</option>
              <option value="KY">KY - Kentucky</option>
              <option value="LA">LA - Lousiana</option>
              <option value="MA">MA - Massachusetts</option>
              <option value="MD">MD - Maryland</option>
              <option value="ME">ME - Maine</option>
              <option value="MI">MI - Michigan</option>
              <option value="MN">MN - Minnesota</option>
              <option value="MO">MO - Missouri</option>
              <option value="MS">MS - Mississippi</option>
              <option value="MT">MT - Montana</option>
              <option value="NC">NC - North Carolina</option>
              <option value="ND">ND - North Dakota</option>
              <option value="NE">NE - Nebraska</option>
              <option value="NH">NH - New Hampshire</option>
              <option value="NJ">NJ - New Jersey</option>
              <option value="NM">NM - New Mexico</option>
              <option value="NV">NV - Nevada</option>
              <option value="NY">NY - New York</option>
              <option value="OH">OH - Ohio</option>
              <option value="OK">OK - Oklahoma</option>
              <option value="OR">OR - Oregon</option>
              <option value="PA">PA - Pennsylvania</option>
              <option value="RI">RI - Rhode Island</option>
              <option value="SC">SC - South Carolina</option>
              <option value="SD">SD - South Dakota</option>
              <option value="TN">TN - Tennessee</option>
              <option value="TX">TX - Texas</option>
              <option value="UT">UT - Utah</option>
              <option value="VA">VA - Virginia</option>
              <option value="VT">VT - Vermont</option>
              <option value="WA">WA - Washington</option>
              <option value="WI">WI - Wisconsin</option>
              <option value="WV">WV - West Virginia</option>
              <option value="WY">WY - Wyoming</option>
              <option value="AA">AA - Armed Forces Americas</option>
            </select>
          </div>
          <input
            type         = "text"
            onChange     = {this.props.handleChange.bind( this, 'zip' )}
            className    = { "third right" + ((this.props.missingFields && this.props.missingFields.indexOf('zip') > -1) ? 'inputError' : '')}
            placeholder  = "Zipcode"
            value        = {this.props.address.zip}
            required     = "required" />
        </fieldset>
    );
  }
}