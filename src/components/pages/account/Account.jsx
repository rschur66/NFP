import React, { Component }  from 'react';
import {Link}                from 'react-router';
import {connect}             from 'react-redux';

export default class Account extends Component {

  constructor(props){
    super(props);
    this.state={
      mobileView : false
    };
    this.openMobileView = this.openMobileView.bind(this);
  }

  openMobileView(){
    this.setState ({ mobileView : !this.state.mobileView });
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalOpen";
  }

  render(){
    return(
      <div className="bodyContent secondaryBg account">
        <div className="innerWrapper">
          <div className="col -w20 sideNav">
            <div className="navForMobile">
              <Link activeClassName="active" to="/account/account-info"   onClick={this.openMobileView.bind(this)}><span className="sideLink">Account Info</span></Link>
              <Link activeClassName="active" to="/account/plan"           onClick={this.openMobileView.bind(this)}><span className="sideLink">My Plan</span></Link>
              <Link activeClassName="active" to="/account/shipping"       onClick={this.openMobileView.bind(this)}><span className="sideLink">Shipping Info</span></Link>
              <Link activeClassName="active" to="/account/payment"        onClick={this.openMobileView.bind(this)}><span className="sideLink">Payment Info</span></Link>
              <Link activeClassName="active" to="/account/order-history"  onClick={this.openMobileView.bind(this)}><span className="sideLink">Order History</span></Link>
              <Link activeClassName="active" to="/account/refer-a-friend" onClick={this.openMobileView.bind(this)}><span className="sideLink">Refer a Friend</span></Link>
            </div>
            <div className="navForDesktop">
              <Link activeClassName="active" to="/account/account-info"><span className="sideLink">Account Info</span></Link>
              <Link activeClassName="active" to="/account/plan"><span className="sideLink">My Plan</span></Link>
              <Link activeClassName="active" to="/account/shipping"><span className="sideLink">Shipping Info</span></Link>
              <Link activeClassName="active" to="/account/payment"><span className="sideLink">Payment Info</span></Link>
              <Link activeClassName="active" to="/account/order-history"><span className="sideLink">Order History</span></Link>
              <Link activeClassName="active" to="/account/refer-a-friend"><span className="sideLink">Refer a Friend</span></Link>
            </div>
          </div>
          <div className="col -w80 mainContent">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
    return { 'member': state.member };
}

export default connect(mapStateToProps)(Account);