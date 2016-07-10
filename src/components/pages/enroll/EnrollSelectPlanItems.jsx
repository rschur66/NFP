import React, { Component }     from 'react';
import { connect }              from 'react-redux'; 
import { setEnrollStepAccount } from '../../../modules/enrollStep';
import { bindActionCreators }   from 'redux';
import { get }                  from '../../../svc/utils/net';
import SelectPlanItemsEx1748          from './SelectPlanItemsEx1748.jsx';
import { setEnrollPlan }        from '../../../modules/enrollData';
import { enrollPlanTracking }   from '../../../modules/analytics';

class EnrollSelectPlanItems extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(plan, evt){
    if(evt.target.checked){
      this.props.setEnrollPlan(plan);
      this.props.enrollPlanTracking(plan);
    } 
  }
  
  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/4`);
    });
  }

  render(){
    return (<div className="bodyContent">
      <section className="selectPlan center">
        <h6>Step 4</h6>
        <h1>Pick Your plan</h1>
        <SelectPlanItemsEx1748
            selectedPlan={this.props.selectedPlan}
            handleChange={this.handleChange}
            whatsIncluded={true}
            submitFunction={this.props.setEnrollStepAccount} />
      </section>
    </div>);
  }
}

function mapStateToProps(state){
  return {
    selectedPlan: state.enrollData.plan,
    experiment: state.experiment,
    path: state.analytics.location
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepAccount, setEnrollPlan, enrollPlanTracking }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollSelectPlanItems);
