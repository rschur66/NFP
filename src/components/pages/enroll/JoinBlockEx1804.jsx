import React, { Component }     from 'react';
import { connect }              from 'react-redux';
import { Link }                 from 'react-router';
import { bindActionCreators }   from 'redux';
import SelectPlanItemsEx1804    from './SelectPlanItemsEx1804.jsx';
import { setEnrollPlan }        from '../../../modules/enrollData';
import { enrollPlanTracking }   from '../../../modules/analytics';
import { setEnrollStepAccount } from '../../../modules/enrollStep';

class JoinBlockEx1804 extends Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(plan, evt){
    if(evt.target.checked){
      this.props.setEnrollPlan(plan);
      this.props.enrollPlanTracking(plan);
    }
  }

  render() {
    return (
        <section className="JoinBlock">
          <div className="center">
            <h1 className="knockout">Join the Club</h1>
            <h4 className="knockout">
              All plans include 1 hardcover book of your choice each month and always free shipping
            </h4>
            <SelectPlanItemsEx1804
                selectedPlan={this.props.selectedPlan}
                handleChange={this.handleChange}
                whatsIncluded={false}
                submitFunction={this.props.setEnrollStepAccount} />
            <div className="actionGroup">
              <Link to="/enroll" className="button secondary">GET STARTED</Link>
            </div>
          </div>
        </section>
    );
  }
}

function mapStateToProps(state){
  return {
    selectedPlan: state.enrollData.plan
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepAccount, setEnrollPlan, enrollPlanTracking }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinBlockEx1804);
