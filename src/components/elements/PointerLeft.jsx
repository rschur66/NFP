import React  from 'react';

const PointerLeft = (props) => {
  return(
    <div 
      className={"pointer left" + ((props.pointerPrevActive) ? '' : ' hide') }
      onClick={props.handleClick}
    >
      <svg version="1.1"x="0px" y="0px" width="18.25px" height="34px" viewBox="0 0 18.25 34" enableBackground="new 0 0 18.25 34">
        <polygon fill="#11AFE2" points="17.157,0.343 0.257,17.244 17.014,34 18.029,32.985 2.288,17.243 18.172,1.357 "/>
      </svg>
    </div>
  );
}

export default PointerLeft;