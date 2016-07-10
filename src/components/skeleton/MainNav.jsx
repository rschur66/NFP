import React, { Component }   from 'react';
import { Link }               from 'react-router';
import { connect }            from 'react-redux';
import { memberLogout }       from '../../modules/member';
import { bindActionCreators } from 'redux';
import PointerUpDown          from '../elements/PointerUpDown.jsx';
import BoxIcon                from '../elements/BoxIcon.jsx';

class MainNav extends Component {
  logOut(){
    this.props.memberLogout();
    if (this.props.toggleMobileNav) this.props.toggleMobileNav();
    return false;
  }

  closeEverything(){
    this.props.hideBook();
    this.props.hideJudge();
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
  }

  render(){

    let oLinks =(
        <ul className="loggedOut">
          <li><Link activeClassName="active" to="/magazine"         onClick={this.props.toggleMobileNav}>BOTM Magazine</Link></li>
          <li><Link activeClassName="active" to="/learn-more"       onClick={this.props.toggleMobileNav}>Learn More</Link></li>
          <li><Link activeClassName="active" to="/about-selections" onClick={this.props.toggleMobileNav}>Selections</Link></li>
          <li><Link activeClassName="active" to="/our-story"        onClick={this.props.toggleMobileNav}>Our Story</Link></li>
          <li><Link to="/enroll" className="button primary">Join Now</Link></li>
        </ul>
      );

    if (this.props.isLoggedIn){
      oLinks = (
        <ul className="loggedIn">
          <li><Link activeClassName="active" to="/my-botm"     onClick={this.props.toggleMobileNav}>My BOTM</Link></li>
          <li><Link activeClassName="active" to="/more-books"  onClick={this.props.toggleMobileNav}>More Books</Link></li>
          <li><Link activeClassName="active" to="/magazine"    onClick={this.props.toggleMobileNav}>Magazine</Link></li>
          <li><Link activeClassName="active" to="/discussions" onClick={this.props.toggleMobileNav}>Discussions</Link></li>
          <li className="subNavWrapper"><span className="subNavHeader">More</span>
            <PointerUpDown />
            <ul className="subNav">
              <li className="mobileHide"><Link activeClassName="active" to="/judges" onClick={this.props.toggleMobileNav}>Judges</Link></li>
              <li><Link activeClassName="active" to="/account" onClick={this.props.toggleMobileNav}>Account</Link></li>
              <li className="mobileHide" ><Link activeClassName="active" to="/gift" onClick={this.props.toggleMobileNav}>Give A Gift</Link></li>
              <li><Link activeClassName="active" to="/contact-us" onClick={this.props.toggleMobileNav}>FAQ</Link></li>
              <li className="mobileButton"><a activeClassName="active" href="#" onClick={this.logOut.bind(this)}>Log Out</a></li>
            </ul>
          </li>
          <li className="mobileHide" ><Link to="/my-box" activeClassName="active" onClick={this.closeEverything.bind(this)} className="headerBoxLink"><BoxIcon boxCount={this.props.boxCount}/></Link></li>
        </ul>
      );
    }

    return(
      <nav>
        {oLinks}
      </nav>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoggedIn : state.member ? true : false
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ memberLogout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MainNav);
