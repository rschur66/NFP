import React, { Component }   from 'react';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import dateformat             from "dateformat";
import { changeRenewalPlan }  from '../../../modules/member';
import { Link }               from 'react-router';
import SelectPlanItems        from './SelectPlanItems.jsx';

export default class PlanInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      error: null,
      pending: false,
      new_renewal_plan: props.subscription && props.subscription.renewal_plan ? props.subscription.renewal_plan : null
    };
    this.handleRenewalChange  = this.handleRenewalChange.bind(this);
    this.changeRenewalPlan    = this.changeRenewalPlan.bind(this);
    this.toggleContent        = this.toggleContent.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( (nextProps.subscription && nextProps.subscription.renewal_plan != this.props.subscription.renewal_plan) || this.state.pending )
      this.setState({ pending: false });
  }

  toggleContent(){ this.setState ({ showContent : !this.state.showContent });}
  handleRenewalChange( plan, evt ) { if(evt.target.checked) this.setState({ new_renewal_plan : plan });}

  changeRenewalPlan(){
    if(this.state.new_renewal_plan && !this.state.pending ){
      this.setState({ error: null, pending: true });
      this.toggleContent();
      this.props.changeRenewalPlan(this.state.new_renewal_plan.id);
    } else {
      this.setState({ error: "You must select a renewal plan to update."});
    }
  }

  render(){
    let { member, subscription, store_can_pick } = this.props,
        currentDate      = new Date (),
        renewalPlanText  = "You do not have a renewal plan",
        currentPlanText  = "You do not currently have a subscription.",
        renewalMessage   = (<div/>),
        planAction       = (<button className="primary narrow" onClick={this.toggleContent.bind(this)} >Change Your Renewal Plan</button>);

    if( subscription ){
      currentPlanText = subscription.plan.name + " membership";
      let rawLastDay      = new Date((subscription.last_year + 2015), subscription.last_month + (member.box.books[0] === null && member.can_pick && store_can_pick ? 2 : 1), 0),
          cleanDate       = dateformat( rawLastDay , "mmmm dS yyyy"),
          expirationDate  = new Date( (subscription.last_month + 1) + "/1/" + (subscription.last_year + 2015) ),
          expired         = currentDate > expirationDate && currentDate.getMonth() !== expirationDate.getMonth() && currentDate.getYear() !== expirationDate.getYear() ? true : false;
      if( subscription.renewal_plan && subscription.will_renew ) renewalPlanText = subscription.renewal_plan.name + " membership, set to renew on " + cleanDate + " at $" + subscription.renewal_plan.price;
      else renewalPlanText = "Your " + (subscription.plan.name + " membership ") + ( expired ? "expired " + cleanDate : "will expire on " + cleanDate );
    }

    if(!subscription){
      if(member.subscription_history[0] !== undefined){
        if(member.subscription_history[0].will_renew){
          planAction = (<Link className="button primary narrow" to="/renewal" >Fix It</Link>);
          renewalMessage = (<h5 className="error">We encountered an error when we tried to renew your membership. Your account is now inactive. </h5>);
        }
        if(member.subscription_history[0].will_renew===0){
          planAction = (<Link className="button primary narrow" to="/renewal" >Rejoin</Link>);
          renewalMessage = (<h5 className="error">Your membership has expired. It’s time to rejoin Book of the Month!</h5>);
        }
      }
    }

    return(
      <section className="planInfo">
        <h1 className="sectionHeader">Your Plan</h1>
          <div className={"content toggledContent" + ((this.state.showContent) ? ' hide' : ' show')}>
          <table className="dataTable">
            <tbody>
              <tr>
                <td>Current Plan:</td><td>{currentPlanText}</td>
              </tr>
              <tr>
                <td>Renewal Plan:</td><td>{renewalPlanText}</td>
              </tr>
            </tbody>
          </table>
          {renewalMessage}
          <div className="confirmationActions">
            {planAction}
            <Link to="/account/order-history" className="button secondary narrow" >Membership History</Link>
          </div>
        </div>


        <div className={"content toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
          <h5>Choose a new plan below to change your renewal plan.</h5>
          {this.state.error ? (<p className="error">{this.state.error}</p>) : (<div />)}
            <SelectPlanItems
              selectedPlan={this.state.new_renewal_plan}
              handleChange={this.handleRenewalChange}
              submitFunction={this.changeRenewalPlan}
              toggleContent = {this.toggleContent} />
        </div>

      </section>
    );
  }
}


function mapStateToProps(state){
    return {
      store_can_pick: state.storeData.can_pick,
      subscription: state.member.subscription,
      member: state.member,
    };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ changeRenewalPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanInfo);