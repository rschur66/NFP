import React, { Component } from 'react';
import PostListItem from './PostListItem.jsx';

export default class FeaturedPosts extends Component{
  render(){
    let posts = this.props.posts.map ( (oPost, i) => {
      return( <PostListItem post = {oPost} key = {i}/> );
    });

    return(
        <div className="featured">
          {posts}
        </div>
    );
  }
}