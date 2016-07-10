import React, {Component}       from 'react';
import { connect }              from 'react-redux';
import dateformat               from "dateformat";
import { bindActionCreators }   from 'redux';
import { skipThisMonth }        from '../../../modules/member_box';

export default class SkipMonth extends Component{

  constructor(props){
    super(props);
    this.state = {
      viewConf : false
    }
  }

  showConf(){
    this.setState ({ viewConf : !this.state.viewConf });
  }

  skipThisMonth(){
    this.props.skipThisMonth();
    this.showConf();
  }

  render(){

    let subscription  = this.props.subscription,
        currentMonth  = new Date( this.props.storeTime),
        boxLength     = this.props.memberBox[0],
        rawLastDay    = '',
        rawNewLastDay = '',
        cleanDate     = '',
        cleanNewDate  = '';

    if(subscription){
      rawLastDay    = new Date((subscription.last_year + 2015), subscription.last_month+1, 0);
      rawNewLastDay = new Date((subscription.last_year + 2015), (subscription.last_month+2), 0);
      cleanDate     = dateformat( rawLastDay , "mmmm dS yyyy");
      cleanNewDate  = dateformat( rawNewLastDay , "mmmm dS yyyy");
    }


    if(!subscription || boxLength=== null || !this.props.store_can_pick || !this.props.can_pick ) return ( <div /> );

    return(
      <section className="skipMonth">
        <div className = {"modalWrapper" + ((this.state.viewConf) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.showConf.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center">
              <img src="/img/bom/ill-skipMonth.svg" />
              <h3>Are you sure you want to skip this month?</h3>
              <h5>
                If you skip this month, you will not receive a {dateformat( currentMonth, "mmmm" )} book and your expiration date will change from
                {" " + cleanDate} to {cleanNewDate}. 
              </h5>
              <div className="confirmationActions">
                <button className="primary" onClick={this.skipThisMonth.bind(this)}>Yes</button>
                <button className="secondary" onClick={this.showConf.bind(this)}>Nevermind</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4>Don't like the selections this month? No Problem!</h4>
          <button className="secondary alt" onClick={this.showConf.bind(this)}>Skip this month</button>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state){
  return { 
    subscription    : state.member.subscription,
    memberBox       : state.member ? state.member.box.books : [],
    store_can_pick  : state.storeData.can_pick,
    can_pick        : state.member ? state.member.can_pick : false,
    storeTime       : state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ skipThisMonth }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(SkipMonth);
