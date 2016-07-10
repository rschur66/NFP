import React, { Component } from 'react';
import CheckMark            from './CheckMark.jsx';
import {connect}            from 'react-redux';
import { setEnrollStepEmail } from '../../modules/enrollStep';
import { bindActionCreators } from 'redux';
import { setEnrollFrequency } from '../../modules/enrollData';


export default class SurveyFrequency extends Component{
  handleChange(frequency, evt){
    if(evt.target.checked) this.props.setEnrollFrequency(frequency);
  }

  render(){
    const existingFrequencies = ["1-2", "3-4", "5-9", "10+"];
    let selectedFrequency = {};
    existingFrequencies.forEach( x => selectedFrequency[x] = (this.props.frequency === x ? "checked" : "") );

    return(
          <div className="surveyFrequency">
            <h1>How many books do you <br /> read a month?</h1>
            <h4>Select one</h4>

              <ul className="customBigSelects">
                <li>
                  <label>
                    <input type="radio" name="frequency" value="<1" onChange={this.handleChange.bind(this, "<1")} checked={selectedFrequency["<1"]} />
                    <div>
                      <CheckMark />
                      <div className="topContent">
                        <img src="/img/bom/frequency/1-2.svg" />
                      </div>
                      <div className="bottomContent">
                        <h6>Less than 1</h6>
                      </div>
                    </div>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="frequency" value="1-2" onChange={this.handleChange.bind(this, "1-2")} checked={selectedFrequency["1-2"]} />
                    <div>
                      <CheckMark />
                      <div className="topContent">
                        <img src="/img/bom/frequency/3-4.svg" />
                      </div>
                      <div className="bottomContent">
                        <h6>1-2</h6>
                      </div>
                    
                    </div>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="frequency" value="3-4" onChange={this.handleChange.bind( this, "3-4")} checked={selectedFrequency["3-4"]} />
                    <div>
                      <CheckMark />
                      <div className="topContent">
                        <img src="/img/bom/frequency/5-9.svg" />
                      </div>
                      <div className="bottomContent">
                        <h6>3-4</h6>
                      </div>

                    </div>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="frequency" value="5+" onChange={this.handleChange.bind(this, "5+")} checked={selectedFrequency["5+"]} />
                    <div>
                      <CheckMark />
                      <div className="topContent">
                        <img src="/img/bom/frequency/10.svg" />
                      </div>
                      <div className="bottomContent">
                        <h6>5+</h6>
                      </div>
                    </div>
                  </label>
                </li>
              </ul>

          <button className="primary fat" onClick={() => this.props.nextStep()}>Continue</button>
          </div>
    );
  }
}

function mapStateToProps(state){
  return { 'frequency': state.enrollData.frequency }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ setEnrollFrequency }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyFrequency);