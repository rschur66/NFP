import React, { Component } from 'react';
import PostListItem from './PostListItem.jsx';

export default class FeaturedPostsCarousel extends Component{
  render(){
    let posts = this.props.posts.map ( (oPost, i) => {
      return( <PostListItem post = {oPost} key = {i}/> );
    });

    return(
        <div className="sliderWrapper featured">
          <ul className="sliderItemsContainer">
            {posts}
          </ul>
        </div>
    );
  }
}