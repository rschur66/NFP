import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { setGiftStepAccount } from '../../../modules/giftStep';
import { setEnrollPlan }      from '../../../modules/enrollData';
import SelectGiftPlans        from './SelectGiftPlans.jsx';

export default class GiveGift extends Component{
 constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(plan, evt){
    if(evt.target.checked) this.props.setEnrollPlan(plan);
  }

  render(){
    return(
      <div>
        <section className="selectPlan center">
            <h6>Step 1</h6>
            <h1>Select a gift plan</h1>
             <SelectGiftPlans 
              selectedPlan={this.props.selectedPlan}
              handleChange={this.handleChange}
              whatsIncluded={true}
              submitFunction={this.props.setGiftStepAccount}  />
          </section>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { selectedPlan : state.enrollData.plan };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollPlan, setGiftStepAccount }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GiveGift);