import React, { Component } from 'react';
import { Link }             from 'react-router';
import { connect }          from 'react-redux'; 
import SocialIcons          from '../../elements/SocialIcons.jsx';
import dateformat           from "dateformat";

class EnrollConfirmation extends Component{


  render(){
    let isPickingPeriod = ((this.props.store_can_pick) ? true : false),
        actionMessage   = "",
        actionImage     = "ill-pickBook.svg",
        actionLink      = "/my-botm",
        bottomLink      = "/more-books",
        bottomLinkImage = "ill-pastSelections.svg",
        bottomLinkText  = "View Past Selections",
        currentMonth    = new Date(this.props.storeTime),
        newMonth        = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1);

      if (isPickingPeriod){
        actionMessage   = "Select your first book of the month";
      }else{
        actionMessage   = "Select your first book of the month on " + dateformat( newMonth, "mmmm" ) + " 1st.";
        actionImage     = "ill-theFirst.svg";
        actionLink      = "/my-botm";
        bottomLink      = "/learn-more";
        bottomLinkImage = "ill-howItWorks.svg";
        bottomLinkText  = "How It Works";
      }
    return(
      <div className="bodyContent enrollConfirmation center">
        <section className="innerWrapper center"> 
          <div className="headerWrapper">
            <div className="col -w20 left"></div>
            <div className="col -w60">
              <h6>Success!</h6>
              <h1>Welcome Back!</h1>
              <h4>Your order has been confirmed! You will receive an email with the details of your order shortly.</h4>
            </div>
            <div className="col -w20 right"></div>
          </div>
          <section className="actionMessage center">
            <ul className="linkBoxes">
              <li>
                <Link to={actionLink}>
                  <div className="topContent">
                    <img src={'/img/bom/' + actionImage} />
                  </div>
                  <div className="bottomContent">
                    <h6>{actionMessage}</h6>
                  </div>
                </Link>
              </li>
            </ul>
          </section>
          <section className="center">
            <ul className="linkBoxes">
              <li>
                <Link to="magazine">
                  <div className="topContent">
                    <img src="/img/bom/ill-magazine.svg" />
                  </div>
                  <div className="bottomContent">
                    <h6>GO TO MAGAZINE</h6>
                  </div>
                </Link>
              </li>
              <li>
                <Link to={bottomLink}>
                  <div className="topContent">
                    <img src={'/img/bom/' + bottomLinkImage}/>
                  </div>
                  <div className="bottomContent">
                    <h6>{bottomLinkText}</h6>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="contact-us">
                  <div className="topContent">
                    <img src="/img/bom/ill-custService.svg" />
                  </div>
                  <div className="bottomContent">
                    <h6>Questions?<br />Email or Call Us</h6>
                  </div>
                </Link>
              </li>
            </ul>
          </section>
          <div  className="socialWrapper center">
            <h5>Connect with us</h5>
            <SocialIcons />
          </div>
        </section>

      </div>
    );
  }
}


function mapStateToProps(state){
  return {
    store_can_pick: state.storeData.can_pick,
    plan: state.enrollData.plan,
    memberId: state.member.id,
    storeTime: state.storeTime
  };
}

export default connect(mapStateToProps)(EnrollConfirmation);