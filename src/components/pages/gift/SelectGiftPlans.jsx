import React, { Component } from 'react';
import { connect }          from 'react-redux'; 
import WhatsIncluded        from '../enroll/WhatsIncluded.jsx'
import CheckMark            from '../../elements/CheckMark.jsx'

class SelectGiftPlans extends Component{
  constructor(props){
    super(props);
    this.state = { error: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt){
    if(evt && evt.preventDefault ) evt.preventDefault();
    this.setState({ error: null });
    if( this.props.selectedPlan ) this.props.submitFunction();
    else this.setState({ error: "Please select a membership plan to continue."});
  }

  renderList(){
    let {selectedPlan, giftPlans, handleChange} = this.props;
    return giftPlans.map((plan) =>{
      return(
        <li key={plan.id}>
          <label>
            <input type="radio" name="plan" value="{plan.plan}" onChange={handleChange.bind(this, plan)} checked={ selectedPlan && selectedPlan.id === plan.id ? "checked": ""} />
            <div>
              <div className="topContent">
                <h4>{plan.name}</h4>
                <h4>GIFT MEMBERSHIP</h4>
                <CheckMark />
              </div>
              <div className="bottomContent">
                <h1>${plan.price}</h1>
              </div>
            </div>
          </label>
        </li>
      );
    });
  }

  render(){
    let oWhatsIncluded = (<div />);
    if(this.props.whatsIncluded) oWhatsIncluded = (<WhatsIncluded />);
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          {this.state.error ? (<p className="error">{this.state.error}</p>) : <div />}
          <fieldset className="center">
            <ul className="customBigSelects alt giftPlanSelect">
              {this.renderList()}
            </ul>
          </fieldset>
          <button className="button primary fat forMobile" >Continue</button>
          <button className="button primary fat forDesktop">Continue</button>
          {oWhatsIncluded}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { giftPlans : state.storeData.gift_plans };
}

export default connect(mapStateToProps)(SelectGiftPlans);