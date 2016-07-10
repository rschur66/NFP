/* *******************************
Component for showing guest judges list
********************************** */
import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import { push }               from 'react-router-redux';
import { bindActionCreators } from 'redux';


class JudgesListGuests extends Component{
  renderJudges(){
    return this.props.judgesGuests.map((judge)=>{
      return(
        <li className="sliderItem" key={judge.id} onClick={() => this.props.push('/judges/' + encodeURIComponent(judge.name.replace(/\s+/g, '-').toUpperCase()) + '-' + judge.id)}>
          <div className="judge">
            <img src={"//s3.amazonaws.com/botm-media/judges/" + judge.img} className="judgeListImg" />
            <h5 className="judgeName">{judge.name}</h5>
            <h5 className="judgeRole" dangerouslySetInnerHTML={{__html: judge.role}}/>
          </div>
        </li>
      );
    });
  }
  
  render(){ 
    return(
      <div className="sliderWrapper">
        <ul className="sliderItemsContainer">
          {this.renderJudges()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { judgesGuests : Object.values(state.judges).filter( x => x.guest === 1) };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ push }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JudgesListGuests);