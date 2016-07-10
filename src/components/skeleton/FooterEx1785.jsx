import React, { Component } from 'react';
import Logo                 from '../elements/Logo.jsx';
import SocialIcons          from '../elements/SocialIcons.jsx';
import {Link}               from 'react-router';
import { connect }          from 'react-redux';

class FooterEx1785 extends Component {

  render() {

    let connectStyle = {
        margin: '0 auto',
        width: '90%'
        },
        footerStyle = {
          textAlign: 'center',
          width: '100%'
        },
        finePrintStyle = {
          textAlign: 'center'
        };

    return (
      <footer className="footer primaryBg test" style={footerStyle}>
        <div style={connectStyle}>
          <h6>Connect with us</h6>
          <SocialIcons />
          <Logo />
        </div>
        <div className="finePrintWrapper" style={finePrintStyle}>
          <a href="http://account.shareasale.com/shareasale.cfm?merchantID=61119&storeID=1" className="link finePrint">Affiliate Program</a>&nbsp;/&nbsp;
          <Link to="/privacy-policy" className="link finePrint">Privacy Policy</Link>&nbsp;/&nbsp;
          <Link to="/terms-of-service" className="link finePrint">Terms of Use</Link>
          <div className="finePrint">
            &copy;2016 Bookspan LLC. Book-of-the-Month Club&reg; are registered trademarks of Bookspan LLC.
          </div>
          <div className="finePrint">Unauthorized use prohibited. All rights reserved.</div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(state){
  return {
    isLoggedIn : state.member ? true : false,
  };
}

export default connect(mapStateToProps) (FooterEx1785);