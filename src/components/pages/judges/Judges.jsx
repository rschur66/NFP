/* *******************************
Page for displaying judges
past and present.
********************************** */

import React, { Component }   from 'react';
import JudgesList             from './JudgesList.jsx';
import JudgesListGuests       from './JudgesListGuests.jsx';
import JudgeDetails           from './JudgeDetails.jsx';
import SelectionDetails       from '../selections/SelectionDetails.jsx';
import DetailsMobile          from '../selections/DetailsMobile.jsx';
import { connect }            from 'react-redux';
import { showJudgeModal, hideJudge }  from '../../../modules/active_judge';
import { bindActionCreators } from 'redux';

export default class Judges extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount(){
    if( typeof document !== 'undefined' ){
      let { judge } = this.props.params;
      if( judge ){
        let judge_id = parseInt(judge.substr(judge.lastIndexOf('-') + 1));
        if( !isNaN(judge_id) && typeof judge_id === "number" && this.props.judges[judge_id] )
          this.props.showJudgeModal( this.props.judges[judge_id] );
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.params != this.props.params && typeof document !== 'undefined'){
      let { judge } = nextProps.params;
      if( judge ){
        let judge_id = parseInt(judge.substr(judge.lastIndexOf('-') + 1));
        if( !isNaN(judge_id) && typeof judge_id === "number" && this.props.judges[judge_id] )
          return this.props.showJudgeModal(this.props.judges[judge_id] );
      }
      if( !judge || typeof judge_id === 'undefined' || isNaN(judge_id) || typeof judge_id !== "number" || !props.judges[judge_id])
        this.props.hideJudge();
    }
  }

  render(){
    return(
      <div className="judges">
        <JudgeDetails />
        <SelectionDetails />
        <DetailsMobile />
        <section className="guest">
          <div className="bodyContent center">
            <h1>Meet the Judges</h1>
            <h3>Guest Judges</h3>
            <ul>
              <JudgesListGuests />
            </ul>
          </div>
        </section>
        <section className="reocurring">
          <div className="center">
            <h3>Reoccuring Judges</h3>
            <ul>
              <JudgesList />
            </ul>
          </div>
        </section>
      </div>
    );
  }
};


function mapStateToProps(state){
  return { judges : state.judges };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showJudgeModal, hideJudge }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Judges);