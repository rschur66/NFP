import React  from 'react';

const PointerRight = (props) => {
  return(
    <div 
      className={"pointer right" + ((props.pointerNextActive) ? '' : ' hide') }
      onClick={props.handleClick}
    >
      <svg version="1.1" x="0px" y="0px" width="18.25px" height="34px" viewBox="0 0 18.25 34" enableBackground="new 0 0 18.25 34">
        <polygon fill="#11AFE2" points="1.35,34.001 18.25,17.1 1.493,0.344 0.478,1.358 16.22,17.101 0.335,32.986 "/>
      </svg>
    </div>
  );
}

export default PointerRight;