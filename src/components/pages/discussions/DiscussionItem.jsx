import React, { Component } from 'react';
import { Link }             from 'react-router';
import ReplyForm            from './ReplyForm.jsx';
import EditForm             from './EditForm.jsx';
import Reply                from './Reply.jsx';
import {connect}            from 'react-redux';
import LikeButton           from './LikeButton.jsx';
import PointerUpDown        from '../../elements/PointerUpDown.jsx';

export default class DiscussionItem extends Component{
  constructor(){
    super();
    this.state = {
      isOpen: true,
      editState: false
    }
    this.toggleShowDiscussionReplies = this.toggleShowDiscussionReplies.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( !this.props.showAllReplies && nextProps.showAllReplies )
      this.setState({ isOpen: true });
    else if( this.props.showAllReplies && !nextProps.showAllReplies )
      this.setState({ isOpen: false });
  }

  toggleShowDiscussionReplies(){
    this.setState({ isOpen: !this.state.isOpen });
  }

  toggleEditView(){
    this.setState({ editState: !this.state.editState });
  }

  getMemberImgUrl(member) {
    let memberPictureUrl = member.picture_url;
    let avatarUrl = "//s3.amazonaws.com/botm-userphotos/userphotos/avatar_default_large.jpeg";
    if (memberPictureUrl === 'placeholder.jpg' || memberPictureUrl === null) {
      return avatarUrl;
    } else {
      let avatarUrl = "//s3.amazonaws.com/botm-userphotos/userphotos/member" + member.id + "avatar.jpeg";
      return avatarUrl;
    }
  }

  render(){
    let oReplies = this.props.discussion.replies.map ( (oReply, i) => {
      return( <Reply reply={oReply} key = {i}  params={this.props.params}
        getMemberImgUrl={this.getMemberImgUrl} /> );
    });

    let canEdit = (!this.props.member || this.props.discussion.member.id !== this.props.member.id) ? (<div></div>) :
      (<EditForm
        discussionId={this.props.discussion.id}
        title={this.props.discussion.title_raw}
        body={this.props.discussion.body_raw}
        toggleEditView={this.toggleEditView}
        editState={this.state.editState}
        params={this.props.params} />
      );

    return(
      <div className="discussionWrapper root">

        <img src={this.getMemberImgUrl(this.props.discussion.member)} className="memberImg" />
        <div className="discussion">
          <Link to={"/discussions/product/" + this.props.discussion.product_id}
            className="discussionBook button secondary alt"
            activeClassName="active">
            {this.props.discussion.product_title}
          </Link>
          <h6>{this.props.discussion.member.display_name} ({this.props.discussion.member.activity})</h6>

          {canEdit}

          <div className={!this.state.editState ? "show": "hide"}>
            <div className="h4 discussionTitle" dangerouslySetInnerHTML={{__html: this.props.discussion.title }} />
            <div className="discussionBody" dangerouslySetInnerHTML={{__html: this.props.discussion.body}} />
          </div>
          <span
            className={"smallText replyCount" + ((this.state.isOpen) ? " expanded" : " collapsed")}
            onClick={() => this.toggleShowDiscussionReplies()}>({this.props.discussion.reply_count}) Replies
            <PointerUpDown />
          </span>
          <ReplyForm
            discussionId={this.props.discussion.id}
             params={this.props.params} />
          <div className={"replies" + ((this.state.isOpen) ? " show" : " hide")}>
            {oReplies}
          </div>
        </div>
      </div>
    );
  }
}


function mapStatetoProps(state){
  return { 'member': state.member };
}

export default connect(mapStatetoProps)(DiscussionItem);
