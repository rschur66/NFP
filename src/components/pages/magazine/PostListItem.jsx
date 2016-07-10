import React, { Component } from 'react';
import {Link} from 'react-router';

export default class PostListItem extends Component{

  render(){
    return(
      <li className="sliderItem postsListItem">
        <Link to={"/magazine/post/" + this.props.post.id} >
          <img src={ "//s3.amazonaws.com/botm-media/magazine/images/" + this.props.post.cover_img } className ="postImg" />
          <div className="postDescription">
            <h6 className="postDate">{ new Date(this.props.post.live_date).toDateString().slice(4) }</h6>
            <h3 className="postTitle">{this.props.post.title}</h3>
            <p className="postSubtitle">{this.props.post.subtitle}</p>
          </div>
        </Link>
      </li>
    );
  }
}