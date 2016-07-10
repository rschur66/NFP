import React, { Component } from 'react';
import Logo                 from '../elements/Logo.jsx';
import SocialIcons          from '../elements/SocialIcons.jsx';
import {Link}               from 'react-router';
import { connect }          from 'react-redux';

class Footer extends Component {

  render() {

    return (
      <footer className="footer primaryBg">
        <div className="footerLinks">
          <ul className="itemList linkGroup">
            <li><h6>Support</h6></li>
            <li><Link to="/contact-us">FAQs</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/terms-of-membership">Membership Terms</Link></li>
          </ul>
          <ul className="itemList linkGroup">
            <li><h6>Join Us</h6></li>
            <li><Link to="/gift/redeem">Redeem a Gift</Link></li>
            <li><Link to="/gift">Give a Gift</Link></li>
            <li className={(this.props.isLoggedIn)? 'hide': ''}><Link to="/enroll">Join</Link></li>
          </ul>
          <ul className="itemList linkGroup">
            <li><h6>More</h6></li>
            <li><Link to="/learn-more">Learn More</Link></li>
            <li><Link to="/about-selections">Selections</Link></li>
            <li><Link to="/our-story">Our Story</Link></li>
            <li><Link to="/judges">Judges</Link></li>
            <li><Link to="/more-books">More Books</Link></li>
          </ul>
        </div>
        <div className="connect">
          <h6>Connect with us</h6>
          <SocialIcons />
          <Logo />
        </div>
        <div className="finePrintWrapper">
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

export default connect(mapStateToProps) (Footer);