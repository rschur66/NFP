import React, { Component }   from 'react';

import AccountInfo  from './AccountInfo.jsx';
import ShippingInfo from './ShippingInfo.jsx';
import PaymentInfo  from './PaymentInfo.jsx';
import PlanInfo     from './PlanInfo.jsx';

export default  class AccountLanding extends Component {

  constructor(props){
    super(props);
    this.state = { 

    }
  }

  handleChange( sType, event ) {
    var oUpdate      = {};
    oUpdate[ sType ] = event.target.value;
    this.setState( oUpdate );
  }

  updateAccountInfo(e){
    e.preventDefault();
  }


  render(){
    return(
      <section className="accountLanding">
        <h1 className="sectionHeader">Your Account</h1>
        <AccountInfo />
        <PlanInfo />
        <ShippingInfo />
        <PaymentInfo />
      </section>
    );
  }
}


