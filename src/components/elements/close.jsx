import React from 'react';

const CloseIcon = (props) => {
  return(
    <div className="closeIcon" onClick={props.action.bind(this)}>
      <svg version="1.1" x="0px" y="0px" width="22.977px" height="22.977px" viewBox="0 0 22.977 22.977" enableBackground="new 0 0 22.977 22.977" >
        <polygon fill="#FFFFFF" points="22.599,21.994 12.148,11.544 22.598,1.094 21.891,0.387 11.441,10.837 0.991,0.387 0.284,1.094 
        10.734,11.544 0.284,21.994 0.991,22.701 11.441,12.251 21.892,22.701 "/>
      </svg>
    </div>
  );
}

export default CloseIcon;