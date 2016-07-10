import React, { Component } from 'react';
import { Link }             from 'react-router';
import { connect }          from 'react-redux';

class SiteMessage extends Component {
  constructor(props) {
    super(props);
      this.state = { showSiteMessage: true };
  }

  toggleSiteMessage() { this.setState({showSiteMessage: !this.state.showSiteMessage}); }

  render() {
    let {member, isLoggedIn, location, subscription} = this.props,
        message = "",
        badCard = false;

    if( isLoggedIn && !subscription ){

      if(!member.subscription && member.subscription_history[0] !== undefined){
        if(member.subscription_history[0].will_renew) badCard = true;
      }

    message = (badCard) ?
    `We encountered an error when we tried to renew your membership. Your account is now inactive.` :
    `Your membership has expired. It’s time to rejoin Book of the Month!`
    }

    if( !isLoggedIn || subscription || location === '/renewal') return (<div />);
    
    return (
        <div className={"siteMessage" + (this.state.showSiteMessage ? ' show' : ' hide')}> 
          <div className="innerWrapper center">
            <div className="close" onClick={this.toggleSiteMessage.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#c3c3c9" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <h5 className="error">{message}</h5>
            <Link to="/renewal" className="button primary narrow" onClick={this.toggleSiteMessage.bind(this)}>REJOIN</Link>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    member        : state.member ? state.member : [],
    isLoggedIn    : state.member ? true : false,
    location      : state.analytics ? state.analytics.location : [],
    subscription  : state.member ? state.member.subscription : []
  }
}

export default connect(mapStateToProps)(SiteMessage);