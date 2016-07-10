/* *******************************
Component for displaying selection 
lockup that is used in lists.
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { showBook }           from '../../../modules/active_book';
import { push }               from 'react-router-redux'


class SelectionListItem extends Component {
  triggerDefaultClick(){
    this.props.showBook(this.props.book);
    this.props.push(this.props.defaultClick);
  }

  render(){
    let judge = this.props.judges[this.props.book.judge_id],
        image = (this.props.book) ? (<img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + this.props.book.img} className="cover" onClick={() => this.triggerDefaultClick()} />) : '',
        judgeImage = (judge) ? (<img src={"//s3.amazonaws.com/botm-media/judges/" + judge.img} className="judgeImg" />) : '',
        judgeName = (judge) ? judge.name : '';

    return(
      <div className="judgesPick">
        {image}
        <div className="judgeInfo" onClick={() => this.props.push('/judges/' + encodeURIComponent(judge.name.replace(/\s+/g, '-').toUpperCase()) + '-' + judge.id)}>
          {judgeImage}
          <h5 className="alt">JUDGE</h5>
          <h5 className="judgeName">{judgeName}</h5>
        </div>
      </div>
    );
  }
};


function mapStateToProps(state){
  return { judges: state.judges };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook, push }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionListItem);
