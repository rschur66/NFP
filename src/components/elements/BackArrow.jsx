import React from 'react';

const BackArrow = (props) => {
  return(
    <div className="backArrow" onClick={props.action.bind(this)}>
      <svg version="1.1" x="0px" y="0px"
          width="23.131px" height="16.625px" viewBox="0 0 23.131 16.625" enableBackground="new 0 0 23.131 16.625" >
        <polygon fill="#fff" points="23.068,7.562 2.973,7.562 9.074,1.46 8.014,0.401 0,8.415 8.062,16.477 9.123,15.416 3.021,9.316 23.068,9.316 "/>
      </svg>
    </div>
  );
};

export default BackArrow;