import React, { Component }   from 'react';
import CheckMark              from '../../elements/CheckMark.jsx';
import {connect}              from 'react-redux';
import { setEnrollStepEmail } from '../../../modules/enrollStep';
import { bindActionCreators } from 'redux';
import SurveyFrequency        from '../../elements/SurveyFrequency.jsx';
import { get }                    from '../../../svc/utils/net';

export default class EnrollSurveyFrequency extends Component{

  componentDidMount(){
      this.props.experiment.forEach(exp => {
          get(`/svc/experiment/${exp.id}/2`);
      });
  }

  render(){
    return(
      <div className="bodyContentCMS center">
          <h6>Step 2</h6>
          <SurveyFrequency nextStep={this.props.setEnrollStepEmail} />
      </div>
    );
  }
}
function mapStateToProps(state){
    return {experiment: state.experiment}
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepEmail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollSurveyFrequency);