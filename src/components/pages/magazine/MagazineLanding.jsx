import React, {Component} from 'react';
import Masthead           from'./Masthead.jsx';
import EmailCapture       from '../../elements/EmailCapture.jsx';
import StickySidePromo    from '../../elements/StickySidePromo.jsx';
import HeroPost           from './HeroPost.jsx';
import FeaturedPosts      from './FeaturedPosts.jsx';
import PostsList          from './PostsList.jsx';
import {connect}          from 'react-redux';

class Magazine extends Component{
  constructor(props){
    super(props);
    this.state={
      topHeight: 760,
      postListLength : 14
    }
  }

  loadMorePosts(){
    let nPostShowing  = this.state.postListLength; // current number of post showing 
    let newlistLength = nPostShowing + 10;
    this.setState({ postListLength : newlistLength })
  }

  render(){
    let listActions = '';
    let pl = this.state.postListLength;
    if(this.state.postListLength < this.props.magazine.length){
      listActions = (
        <a className="button primary" onClick={this.loadMorePosts.bind(this)}>Load More</a>
      );
    }

    return(
      <div className="landing">
        <Masthead />
        <EmailCapture />
        <div className="innerWrapper">
          <section className="heroPostWrapper">
            <HeroPost post={this.props.magazine[0]}/>
          </section>
          <div className="col -w70">
            <section>
              <FeaturedPosts posts={[ this.props.magazine[1], this.props.magazine[2], this.props.magazine[3] ]}/>
            </section>
          </div>
          <StickySidePromo stickSidePromo = {this.props.stickSidePromo} topHeight = {this.state.topHeight}/>
        </div>
        <section className="postsListWrapper">
          <div className="innerWrapper">
            <PostsList posts={ this.props.magazine.slice(4, pl ) } />
            {listActions}
          </div>
        </section>
      </div>
    );
  }
}


function mapStatetoProps(state){
  return { 'magazine': state.magazine };
}

export default connect(mapStatetoProps)(Magazine);