import React from 'react';

const SocialIconInstagram = (props) => {
  return(
    <div className="socialMediaIcon instagram" >
      <a href={"https://www.instagram.com/"+ props.linkPath + "/"} target="new">
        <svg version="1.1" id="instagram" x="0px" y="0px" width="40px" height="40px" viewBox="44 44 40 40" enableBackground="new 44 44 40 40">
          <path fill="#FFFFFF" d="M72.419,63.711c0,4.048-3.387,7.329-7.563,7.329c-4.178,0-7.563-3.281-7.563-7.329
            c0-0.725,0.109-1.426,0.312-2.087h-2.235v10.277c0,0.534,0.437,0.968,0.967,0.968h16.946c0.532,0,0.968-0.434,0.968-0.968V61.624
            h-2.142C72.309,62.285,72.419,62.986,72.419,63.711z"/>
          <ellipse fill="#FFFFFF" cx="64.854" cy="63.447" rx="4.889" ry="4.736"/>
          <path fill="#FFFFFF" d="M70.391,58.85h2.751c0.603,0,1.095-0.494,1.095-1.096v-2.622c0-0.603-0.492-1.094-1.095-1.094h-2.751
            c-0.603,0-1.095,0.492-1.095,1.094v2.622C69.296,58.356,69.788,58.85,70.391,58.85z"/>
          <path fill="#FFFFFF" d="M44,44v40h40V44H44z M76.998,72.545c0,1.851-1.405,3.122-3.123,3.122H55.788
            c-1.718,0-3.123-1.271-3.123-3.122V54.456c0-1.852,1.405-3.123,3.123-3.123h18.087c1.718,0,3.123,1.271,3.123,3.123V72.545z"/>
        </svg>
      </a>
    </div>
  );
}
export default SocialIconInstagram;