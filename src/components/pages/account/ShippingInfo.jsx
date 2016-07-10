import React, { Component }     from 'react';
import {connect}                from 'react-redux';
import { updateMemberShipping } from '../../../modules/member';
import { bindActionCreators }   from 'redux';
import FieldsetShippingInfo     from '../../elements/FieldsetShippingInfo.jsx';

export default  class ShippingInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      showContent : false,
      address: props.address ?
        ({
          street1:  props.address.street1,
          street2:  props.address.street2,
          city:    props.address.city,
          state:   props.address.state,
          zip: props.address.zip
        }) : ({})
    }
    this.updateShippingAddress = this.updateShippingAddress.bind(this);
    this.handleChange          = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( this.props.address != nextProps.address )
      this.setState({address : nextProps.address });
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  handleChange( sType, event ) {
    var oUpdate      = this.state.address;
    oUpdate[ sType ] = event.target.value;
    this.setState({ member: oUpdate });
  }

  updateShippingAddress(e){
    e.preventDefault();
    let addressUpdate = { address: this.state.address };
    this.props.updateMemberShipping(addressUpdate);
    this.toggleContent();
  }


  render(){

    return(
      <section className="shippingInfo">
        <h1 className="sectionHeader">Shipping Info</h1>

        <div className={"content toggledContent" + ((this.state.showContent) ? ' hide' : ' show')}>
          <table className="dataTable">
            <tbody>
              <tr>
                <td>Address:</td>
                <td>{this.props.address.street1}</td>
              </tr>
              <tr>
                <td>Address (cont.):</td>
                <td>{this.props.address.street2}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{this.props.address.city}</td>
              </tr>
              <tr>
                <td>Sate</td>
                <td>{this.props.address.state}</td>
              </tr>
              <tr>
                <td>Zipcode:</td>
                <td>{this.props.address.zip}</td>
              </tr>
            </tbody>
          </table>
          <div className="actionGroup">
          <button className="primary narrow" onClick={this.toggleContent.bind(this)} >Edit</button>
          </div>
        </div>

        <div className={"content toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
          <form onSubmit={this.updateShippingAddress} >
            <FieldsetShippingInfo ref="shippingInfoForm" handleChange = {this.handleChange} address={this.state.address}/>
            <div className="confirmationActions">
              <button className="primary">Update</button>
              <a className="button secondary" onClick={this.toggleContent.bind(this)}>cancel</a>
            </div>
          </form>
        </div>


      </section>
    );
  }
}


function mapStateToProps(state){
    return { 'address': state.member.address };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ updateMemberShipping }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingInfo);
