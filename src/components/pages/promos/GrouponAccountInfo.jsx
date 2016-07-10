import React, { Component }           from 'react';
import CreateAccountInfo              from '../../elements/CreateAccountInfo.jsx';

export default class GrouponAccountInfo extends Component {
  render(){
    return(
      <div className="bodyContent">
        <section className="innerWrapper center">
          <h6>Step 2</h6>
          <div className="enrollAccountInfo">
            <h1>Almost there</h1>
            <h4>Please enter your information below to redeem your Groupon.</h4>

            <CreateAccountInfo isGroupon={true} />
          </div>
        </section>
      </div>
    );
  }
}