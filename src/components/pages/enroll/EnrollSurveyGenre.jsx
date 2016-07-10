import React, { Component }       from 'react';
import {connect}                  from 'react-redux';
import { setEnrollStepFrequency } from '../../../modules/enrollStep';
import { bindActionCreators }     from 'redux';
import SurveyGenre                from '../../elements/SurveyGenre.jsx';
import { get }                    from '../../../svc/utils/net';


export default class EnrollSurveyGenre extends Component{

  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/1`);
    });
  }

  render(){
    return(
      <div className="bodyContentCMS center">
        <h6>Step 1</h6>
        <SurveyGenre nextStep={this.props.setEnrollStepFrequency} />
      </div>
    );
  }
}

function mapStateToProps(state){
  return{ experiment: state.experiment }
}


function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollStepFrequency }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollSurveyGenre);
