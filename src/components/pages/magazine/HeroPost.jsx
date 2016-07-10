import React, { Component } from 'react';
import PostListItem from './PostListItem.jsx';

export default class FeaturedPost extends Component {
  render(){
    return(
      <ul className="hero">
        <PostListItem post = {this.props.post} />
      </ul>
      );
   }
}