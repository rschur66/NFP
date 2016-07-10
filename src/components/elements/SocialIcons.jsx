import React from 'react';

import SocialIconFacebook   from './SocialIconFacebook.jsx';
import SocialIconTwitter    from './SocialIconTwitter.jsx';
import SocialIconInstagram  from './SocialIconInstagram.jsx';

const SocialIcons = (props) => {
  return(
    <div className="socialMedia">
      <SocialIconFacebook linkPath="BookoftheMonth" />
      <SocialIconTwitter linkPath="bookofthemonth" />
      <SocialIconInstagram  linkPath="bookofthemonthclub" />
    </div>
  );
}
export default SocialIcons;