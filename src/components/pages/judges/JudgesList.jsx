/* *******************************
Component for showing reoccuring 
judges list
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { push }               from 'react-router-redux';
import { bindActionCreators } from 'redux';

class JudgesList extends Component{
  renderList(){
    return this.props.judges.map((judge)=>{
      if (this.props.inactiveJudges.indexOf(judge.id) === -1){
        return(
          <li className="sliderItem" key={judge.id} onClick={() => this.props.push('/judges/' + encodeURIComponent(judge.name.replace(/\s+/g, '-').toUpperCase()) + '-' + judge.id)}>
            <div className="judge">
              <img src={"//s3.amazonaws.com/botm-media/judges/" + judge.img} className="judgeListImg" />
              <h5 className="judgeName">{judge.name}</h5>
              <h5 className="judgeRole" dangerouslySetInnerHTML={{__html: judge.role}} />
            </div>
          </li>
        );
      }
    });
  }

  render(){
    return(
      <div className="sliderWrapper">
        <ul className="sliderItemsContainer">
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    judges : Object.values(state.judges).filter( x =>!state.guestJudges.reduce((acc, gj) =>gj.id === x.id ? gj : acc, null )),
    inactiveJudges : state.inactiveJudges
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ push }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JudgesList);