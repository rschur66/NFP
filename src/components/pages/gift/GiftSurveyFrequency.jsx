import React, { Component }         from 'react';
import {connect}                    from 'react-redux';
import { setGiftRedeemStepAccount } from '../../../modules/giftRedeemStep';
import { bindActionCreators }       from 'redux';
import SurveyFrequency              from '../../elements/SurveyFrequency.jsx';

export default class GiftSurveyFrequency extends Component{

  render(){
    return(
      <div className="bodyContentCMS center">
          <h6>Step 3</h6>
          <SurveyFrequency nextStep={this.props.setGiftRedeemStepAccount} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setGiftRedeemStepAccount }, dispatch);
}

export default connect(null, mapDispatchToProps)(GiftSurveyFrequency);