import React, { Component }   from 'react';
import LogoIcon               from '../../elements/LogoIcon.jsx';
import FeaturedPostsCarousel  from './FeaturedPostsCarousel.jsx';
import EmailCapture           from '../../elements/EmailCapture.jsx';
import {connect}              from 'react-redux';

const MagazinePromoBlock = (props) =>{

  return(
    <div className="magPromoBlock">
      <section className="magHeader">
        <LogoIcon />
        <h1>BOTM Magazine</h1>
        <h4>The Book of the Month Selections & Beyond: Interviews, excerpts, images and more.</h4>
      </section>
      <section className="featuredWrapper innerWrapper">
        <FeaturedPostsCarousel posts={props.featuredPosts} />
      </section>
      <EmailCapture />
    </div>
  );
}
export default MagazinePromoBlock;


function mapStatetoProps(state){
  return { 'featuredPosts': [ state.magazine[7], state.magazine[6], state.magazine[3] ] };
}

export default connect(mapStatetoProps)(MagazinePromoBlock);
