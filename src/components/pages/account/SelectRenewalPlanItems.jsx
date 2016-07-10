import React, { Component } from 'react';
import { connect }          from 'react-redux'; 
import WhatsIncluded        from '../enroll/WhatsIncluded.jsx';
import CheckMark            from '../../elements/CheckMark.jsx';

class SelectRenewalPlanItems extends Component{
  constructor(props){
    super(props);
    this.state = { error: null };
  }

  renderList(){
    let {selectedPlan, membershipPlans, handleChangePlan} = this.props;
    return membershipPlans.map((plan) =>{
      return(
        <li key={plan.id}>
          <label>
            <input type="radio" name="plan" value="{plan.plan}" onChange={handleChangePlan.bind(this, plan)}  />
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
    return(
      <div>
        <form onSubmit={this.props.changePlan.bind(this)}>
          {this.state.error ? (<p className="error">{this.state.error}</p>) : <div />}
          <fieldset className="center">
            <ul className="customBigSelects alt forRenewal">
              {this.renderList()}
            </ul>
          </fieldset>
          <div className="confirmationActions">
            <button className="button primary fat">Save Changes</button>
            <a className="button secondary" onClick={this.props.toggleShowPlans}>back</a>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { membershipPlans : state.storeData.renewal_plans };
}

export default connect(mapStateToProps)(SelectRenewalPlanItems);