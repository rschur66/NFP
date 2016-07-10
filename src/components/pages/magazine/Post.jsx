import React, {Component} from 'react';
import {Link} from 'react-router';

import EmailCapture       from '../../elements/EmailCapture.jsx';
import StickySidePromo    from '../../elements/StickySidePromo.jsx';
import FeaturedPosts      from './FeaturedPosts.jsx';
import PointerLeft        from '../../elements/PointerLeft.jsx'
import {connect}          from 'react-redux';
import SocialIconTwitter  from '../../elements/SocialIconTwitter.jsx';
import SocialIconFacebook from '../../elements/SocialIconFacebook.jsx';

class Post extends Component{

  constructor(props){
    super(props);
    this.state={ topHeight: 90 }
    this.handleback = this.handleback.bind(this);
  }

  handleback(){}

  render(){
    let oCurrentPost = this.props.magazine.reduce( (p,x) => x.id === parseInt(this.props.params.id) ? x : p, {} ), oCurrentPostImageVideo = '', oCurrentPostPresummary = '';
    if(oCurrentPost.youtube_link !== null && oCurrentPost.youtube_link !== "")
      oCurrentPostImageVideo =
          (<div className="iframeContainer">
            <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + oCurrentPost.youtube_link + "?rel=0"} frameBorder="0" allowFullScreen></iframe>
          </div>);
    else if(oCurrentPost.post_img !== null && oCurrentPost.post_img !== "")
      oCurrentPostImageVideo = <img src={"//s3.amazonaws.com/botm-media/magazine/images/" + oCurrentPost.post_img} className ="postImg" />;

    if(oCurrentPost.presummary)
      oCurrentPostPresummary =  <section className="postPreSummary" dangerouslySetInnerHTML={{__html: oCurrentPost.presummary}} />;

    return(
      <div className="post">
        <EmailCapture />

        <div className="innerWrapper">
          <div className="postsWrapper">
            <div className="back">
              <PointerLeft action={this.handleback} />
              <Link to="/magazine">BACK TO MAGAZINE</Link>
            </div>
            <div className="postHeader">
              <h6 className="postDate">{ new Date(oCurrentPost.live_date).toDateString() }</h6>
              <h1 className="postTitle">{oCurrentPost.title}</h1>
              <div className="postDescription">
                <h5>{oCurrentPost.author}</h5>
              </div>
              <div className="socialMedia">
                <SocialIconTwitter linkPath = {'magazine/post/'+oCurrentPost.id} linkTitle={oCurrentPost.title}/>
                <SocialIconFacebook linkPath = {'magazine/post/'+oCurrentPost.id} linkTitle={oCurrentPost.title}/>
              </div>
            </div>
            {oCurrentPostImageVideo}
            {oCurrentPostPresummary}
            <section className="postContent" dangerouslySetInnerHTML={{__html: oCurrentPost.summary}} />

            <div className="back">
              <PointerLeft action={this.handleback} />
              <Link to="/magazine">BACK TO MAGAZINE</Link>
            </div>
        </div>

        <StickySidePromo stickSidePromo = {this.props.stickSidePromo} topHeight = {this.state.topHeight} />
      </div>
      
      <section className="featured" id="donotpass">
        <div className="innerWrapper">
          <h3 className="sectionHeader">Featured</h3>
          <FeaturedPosts posts={[ this.props.magazine[1], this.props.magazine[2], this.props.magazine[3] ]} />
        </div>
      </section>

    </div>
  );

  }
  
}

function mapStatetoProps(state){
  return { 'magazine': state.magazine };
}

export default connect(mapStatetoProps)(Post);