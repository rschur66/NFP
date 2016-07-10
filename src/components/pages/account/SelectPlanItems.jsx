import React, { Component } from 'react';
import { connect }          from 'react-redux'; 
import WhatsIncluded        from '../enroll/WhatsIncluded.jsx';
import CheckMark            from '../../elements/CheckMark.jsx';

class SelectPlanItems extends Component{
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
    let {selectedPlan, membershipPlans, handleChange} = this.props;
    return membershipPlans.map((plan) =>{
      return(
        <li key={plan.id}>
          <label>
            <input type="radio" name="plan" value="{plan.plan}" onChange={handleChange.bind(this, plan)} checked={ selectedPlan && selectedPlan.id === plan.id ? "checked": ""} />
            <div>
              <div className="topContent">
                <h4>{plan.name}</h4>
                <h4>MEMBERSHIP</h4>
                <CheckMark />
              </div>
              <div className="bottomContent">
                <div dangerouslySetInnerHTML={{__html: plan.price_label}} />
                <h5>{plan.description}</h5>
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
            <ul className="customBigSelects alt">
              {this.renderList()}
            </ul>
          </fieldset>
          <div className="confirmationActions">
            <button className="button primary fat forDesktop">Save Changes</button>
            <button className="button primary fat forMobile" >Save Changes</button>
            <a className="button secondary" onClick={this.props.toggleContent}>back</a>
          </div>
          {oWhatsIncluded}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { membershipPlans : state.storeData.renewal_plans };
}

export default connect(mapStateToProps)(SelectPlanItems);