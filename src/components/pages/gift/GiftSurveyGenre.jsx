import React, { Component } from 'react';
import {connect}              from 'react-redux';
import { setGiftRedeemStepFrequency }        from '../../../modules/giftRedeemStep';
import { bindActionCreators } from 'redux';
import SurveyGenre from '../../elements/SurveyGenre.jsx';


export default class GiftSurveyGenre extends Component{
  render(){
    return(
      <div className="bodyContentCMS center">
        <h6>Step 2</h6>
        <SurveyGenre nextStep={this.props.setGiftRedeemStepFrequency} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setGiftRedeemStepFrequency }, dispatch);
}

export default connect(null, mapDispatchToProps)(GiftSurveyGenre);
