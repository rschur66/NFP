import React, {Component} from "react";
import {connect} from "react-redux";
import dateformat from "dateformat";
import JoinBlock from "../enroll/JoinBlock.jsx";
import WhatsIncluded from "../enroll/WhatsIncluded.jsx";

export default class LearnMore extends Component {

  render(){
    let extendMessage  = (<div />),
        storeTime      =  new Date(this.props.storeTime),
        todayMonth     =  storeTime.getMonth(),
        todayDay       =  storeTime.getDate(),
        extendDate     = this.props.ship_days.reduce(function(acc, day){
          if (day > todayDay){
            acc.push(day)
          } 
          return acc;
        },[]);

    if(this.props.store_can_pick && (todayDay > 6)){
      extendMessage = (
        <div className="bodyMessage">
          <h4 className="knockout">Extended picking period for new members. Join today and choose your first book by {dateformat( new Date( 2016, todayMonth, extendDate[0] ), "mmmm dS")}.</h4>
        </div>
        ); 
      } 

    return(
      <div className="bodyContent learnMore">
        <div className="vidHeroHeader">
          <div className="vidHeroBackground">
            <img src="/img/bom/videos/unboxing.gif" />
            <video autoPlay="autoPlay" loop="loop">
              <source src="/img/bom/videos/unboxing.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="vidHeroContentWrapper">
            <div className="vidHeroContent">
              <div className="innerWrapper center">
                <h1 className="knockout">Awesome Books. Better Reading.</h1>
                <h1 className="knockout">Every Month.</h1>
              </div>
            </div>
          </div>
        </div>
        <WhatsIncluded />
        <h1 className="bigBarHeader noMargin">How it works</h1>
        <section className="innerWrapper">
          <div>
            <div className="checkerboard">
              <div className="square image">
                <img src="img/bom/ill-curated.svg" />
              </div>
              <div className="square content">
                <h6>1st Of The Month</h6>
                <h2>Five new selections</h2>
                <h4>
                  On the first of each month, we announce five monthly selections, carefully chosen by our Judges.
                </h4>
              </div>
            </div>
          </div>

          <div className="middleRow">
            <div className="checkerboard">
              <div className="square image forMobile">
                <img src="/img/bom/ill-pickBook.svg" />
              </div>
              <div className="square content">
                <h6>6th Of The Month</h6>
                <h2>Choose your book</h2>
                <h4>
                  Choose which books you would like to receive by the sixth of the month, or easily skip the month if you prefer.
                </h4>
              </div>
              <div className="square image forDesktop">
                <img src="/img/bom/ill-pickBook.svg" />
              </div>
            </div>
          </div>
          {extendMessage}
          <div>
            <div className="checkerboard">
              <div className="square image">
                <img src="/img/bom/ill-booksShip.svg" />
              </div>
              <div className="square content">
                <h6>7th Of The Month</h6>
                <h2>Boxes ship – Hurray!</h2>
                <h4>
                  On the seventh of the month, we ship you your box. Happy reading!
                </h4>
              </div>
            </div>
          </div>
        </section>

        <JoinBlock />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    store_can_pick: state.storeData.can_pick,
    ship_days: state.storeData.ship_days,
    storeTime: state.storeTime
  }
}

export default connect(mapStateToProps) (LearnMore);
