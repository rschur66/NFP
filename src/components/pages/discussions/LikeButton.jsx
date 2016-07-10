import React, { Component } from 'react';
import {connect}            from 'react-redux';
import { likeDiscussion, unlikeDiscussion } from '../../../modules/discussions';
import { bindActionCreators } from 'redux';

export default class LikeButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      liked: this.props.liked,
      like_count: this.props.like_count
    }
  }

  componentWillReceiveProps(nextProps){
    if( this.props != nextProps )
      this.setState({
        liked: nextProps.liked,
        like_count: nextProps.like_count
      });
  }

  toggleLike(){
    if(this.state.liked){
      this.props.unlikeDiscussion(this.props.discussionId);
      this.setState({
        liked: false,
        like_count: this.state.like_count -1
      })
    } else {
      this.props.likeDiscussion(this.props.discussionId);
      this.setState({
        liked: true,
        like_count: this.state.like_count +1
      })
    }
  }

  render(){
    return (
      <div className="likeObj">
        <div className={"likeButton" + (this.state.liked ? " liked": "")} onClick={this.toggleLike.bind(this)} />
        <span className="smallText">({this.state.like_count})</span>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ likeDiscussion, unlikeDiscussion }, dispatch);
}

export default connect(null, mapDispatchToProps)(LikeButton);