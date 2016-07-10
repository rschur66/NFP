import React, {Component} from 'react';
import {connect}          from 'react-redux';
import MobileNav          from './MobileNav.jsx';
import BackNav            from './BackNav.jsx';
import Header             from './Header.jsx';
import Footer             from './Footer.jsx';
import SiteMessage        from './SiteMessage.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMobileNav: false,
    };
    this.toggleMobileNav = this.toggleMobileNav.bind(this);
  }

  toggleMobileNav() {
    this.setState({showMobileNav: !this.state.showMobileNav});
  }

  render() {
    return (
      <div>
        <BackNav />
        <MobileNav showMobileNav={this.state.showMobileNav} toggleMobileNav={this.toggleMobileNav} />
        <SiteMessage showSiteMessage={this.state.showSiteMessage} />
        <div className={"outerWrapper"  + (this.state.showMobileNav ? ' mobileOpen' : '')}>
          <Header />
          {this.props.children}
          <Footer />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    store: state,
    isLoggedIn : state.member ? true : false
  };
}
export default connect(mapStateToProps)(App);
