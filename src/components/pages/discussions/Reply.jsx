import React, { Component } from 'react';
import ReplyForm            from './ReplyForm.jsx';
import EditForm             from './EditForm.jsx';
import {connect}            from 'react-redux';
import LikeButton           from './LikeButton.jsx';

export default class Reply extends Component{
  constructor(){
    super();
    this.state = { editState: false };
    this.toggleEditView = this.toggleEditView.bind(this);
  }

  toggleEditView(){
    this.setState({ editState: !this.state.editState });
  }

  render(){
    let oReplies = this.props.reply.replies.map ( (oReply, i) => {
      return( <Reply reply={oReply} key = {i}  params={this.props.params} getMemberImgUrl={this.props.getMemberImgUrl} /> );
    });

    let canEdit = (!this.props.member || this.props.reply.member.id !== this.props.member.id) ? (<div></div>) :
      (<EditForm
        discussionId={this.props.reply.id}
        body={this.props.reply.body_raw}
        toggleEditView={this.toggleEditView}
        editState={this.state.editState}
        params={this.props.params} />
      );

    return(
      <div className="discussionWrapper">
       <img src={this.props.getMemberImgUrl(this.props.reply.member)} className="memberImg" />
        <div className="discussion">
          <h6>{this.props.reply.member.display_name} ({this.props.reply.member.activity})</h6>

          {canEdit}

          <div className={"discussionBody " + ((!this.state.editState) ? "show": "hide")}
            dangerouslySetInnerHTML={{__html: this.props.reply.body}} />

          <div className="actions">
            <ReplyForm discussionId={this.props.reply.id}  params={this.props.params} />
          </div>
          {oReplies}
        </div>
      </div>
    );
  }
}

function mapStatetoProps(state){
  return { 'member': state.member };
}

export default connect(mapStatetoProps)(Reply);
