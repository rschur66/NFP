import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { bindActionCreators }   from 'redux';
import WhatsIncluded        from './WhatsIncluded.jsx';
import { setEnrollPlan }        from '../../../modules/enrollData';
import { enrollPlanTracking } from '../../../modules/analytics';

class SelectPlanItems extends Component{
  constructor(props){
    super(props);
    this.state = { error: null };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(plan, evt){
    if(evt.target.checked) this.props.setEnrollPlan(plan);
    this.handleSubmit(plan);
  }
  
  handleSubmit(plan){
    this.props.enrollPlanTracking(plan);
    this.setState({ error: null });
    if( plan ) this.props.submitFunction();
    else this.setState({ error: "Please select a membership plan to continue."});
  }

  renderList(){
    let {selectedPlan, membershipPlans} = this.props;
    return membershipPlans.map((plan) =>{
      switch(plan.id){
        case 101:
          plan.price_label2 = "<h1><s>$16.99<small>/mo</small></s></h1>";
          plan.price_blurb2 = "GET YOUR FIRST MONTH FOR $8.99!";
          break;
        case 1001:
          plan.price_label2 = "<h1>$16.99<small>/mo</small></h1>";
          break;
        case 1003:
          plan.price_label2 = "<h1>$14.99<small>/mo</small></h1>";
          plan.price_blurb2 = plan.price_blurb;
          break;
        case 1012:
          plan.price_label2 = "<h1>$11.99<small>/mo</small></h1>";
          plan.price_blurb2 = plan.price_blurb;
          break;
      }
      return(
        <li key={plan.id}>
          <label>
            <input type="radio" name="plan" value="{plan.plan}" onChange={this.handleChange.bind(this, plan)} checked={ selectedPlan && selectedPlan.id === plan.id ? "checked": ""} />
            <div>
              <div className="topContent">
                <h4>{plan.name}</h4>
                <h4>MEMBERSHIP</h4>
              </div>
              <div className="bottomContent">
                <div className="desktopOnly" dangerouslySetInnerHTML={{__html: plan.price_label}} />
                <div className="mobileOnly" dangerouslySetInnerHTML={{__html: plan.price_label2 ? plan.price_label2 : plan.price_label}} />
                <h6 className="desktopOnly">{plan.price_blurb}</h6>
                <h6 className="mobileOnly">{plan.price_blurb2 ? plan.price_blurb2 : plan.price_blurb}</h6>
              </div>
            </div>
          </label>
        </li>
      );
    });
  }

  render(){
    let oWhatsIncluded = (<div />);
    if(this.props.whatsIncluded) oWhatsIncluded = (
      <div>
        <WhatsIncluded />
      </div>
    );
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.state.error ? (<p className="error">{this.state.error}</p>) : <div />}
          <fieldset className="center">
            <ul className="customBigSelects alt testVersion">
              {this.renderList()}
            </ul>
          </fieldset>
          {oWhatsIncluded}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { membershipPlans : state.storeData.plans };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollPlan, enrollPlanTracking }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPlanItems);