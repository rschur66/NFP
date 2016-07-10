import React from "react";

const SocialIconFacebook = (props) => {
  return(
    <div className="socialMediaIcon facebook">
      <a href={"http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.bookofthemonth.com%2F" + encodeURIComponent(props.linkPath)}  target="new">
        <svg version="1.1" id="facebook" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40">
          <path fill="#ffffff" d="M0,0v40h40V0H0z M26.488,11.653l-2.352,0.001c-1.844,0-2.203,0.876-2.203,2.163v2.836h4.399l-0.572,4.443h-3.827v11.399 h-4.585V21.098h-3.837v-4.444h3.837v-3.276c0-3.802,2.321-5.873,5.712-5.873c1.627,0,3.021,0.121,3.428,0.175V11.653z"/>
        </svg>
      </a>
    </div>
  );
};
export default SocialIconFacebook;