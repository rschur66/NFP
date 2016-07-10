import React, {Component} from 'react';

import LogoIcon         from '../../elements/LogoIcon.jsx';
import EmailCapture     from '../../elements/EmailCapture.jsx';
import StickySidePromo  from '../../elements/StickySidePromo.jsx';
import HeroPost         from './HeroPost.jsx';
import FeaturedPosts    from './FeaturedPosts.jsx';
import PostsList        from './PostsList.jsx';

export default class Magazine extends Component{
  constructor(){
    super();
  }

  render(){
    return(
      <div className="bodyContent magazine">
        {this.props.children}
      </div>
    );
  }
}