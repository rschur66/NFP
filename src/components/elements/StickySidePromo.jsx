import React, { Component } from 'react';
import { Link }             from 'react-router';
import { connect }          from 'react-redux';

//@TODO Clean Up and fix bottom stop point
class StickySidePromo extends Component{

  constructor(){
    super()
    this.state = {
      lastScrollTop :  0,
      stickSidePromo: false,
    }
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    // if (typeof window !== 'undefined') {
    //   window.addEventListener('scroll', this.handleScroll);
    // }
  }

  componentWillUnmount() {
    // if (typeof window !== 'undefined') {
    //   window.removeEventListener('scroll', this.handleScroll);
    // }
  }

  handleScroll() {
    var scrollPosition = window.scrollY;
    //var topHeight = 760;
    var topHeight = this.props.topHeight;
    // get bottom elements position
    var element = document.getElementById('donotpass');
    var rect = element.getBoundingClientRect();
    var elementTop;

    var scrollTop = document.documentElement.scrollTop?
                    document.documentElement.scrollTop:document.body.scrollTop;
    elementTop  = rect.top+scrollTop;

    if (Math.abs(this.state.lastScrollTop - scrollPosition) <= this.props.minScroll) {
      return;
    }

    if ( // Scroll Down
        scrollPosition > this.state.lastScrollTop 
        && (scrollPosition > topHeight ) 
        && (scrollPosition < elementTop)
      ){
      this.setState({ stickSidePromo: true });
    } else { // Scroll Up

     if ( // Scroll Down
        scrollPosition <= topHeight
        // && (scrollPosition < elementTop)
      ){
        this.setState({stickSidePromo: false});
      }
    }
    this.setState({lastScrollTop: scrollPosition});
  }


  render(){
    let ad    =((this.props.isLoggedIn)? 'giveGift.jpg': 'enrollAd.jpg'),
        adLink=((this.props.isLoggedIn)? '/gift': '/enroll');

    return(
      <div className={"stickySidePromo" + ((this.state.stickSidePromo) ? ' fixed' : '')}>
        <Link to={adLink}>
          <img src={"/img/bom/ads/" + ad} />
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoggedIn : state.member ? true : false
  };
}

export default connect(mapStateToProps)(StickySidePromo);