import React, { Component } from 'react';
import PostListItem from './PostListItem.jsx';

export default class PostsList extends Component {
  render(){
    let posts = this.props.posts.map ( (oPost, i) => {
      return( <PostListItem post = {oPost} key = {i}/> );
    });

    return (
      <div className="postsList">
        <h3 className="sectionHeader">Recent Posts</h3>
        <ul>
          {posts}
        </ul>
      </div>
    );
  }
}

