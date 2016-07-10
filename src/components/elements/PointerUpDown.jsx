import React  from 'react';

const PointerUpDown = (props) => {
  return(
    <div className="upDownPointer">
      <div className="pointerUp">
        <svg version="1.1" id="Layer_1" x="0px" y="0px" width="12.781px" height="5.761px" viewBox="0 0 12.781 5.761" enableBackground="new 0 0 12.781 5.761">
          <polygon fill="#000" points="6.368,0 12.603,5.67 0.243,5.67 "/>
        </svg>
      </div>
      <div className="pointerDown">
        <svg version="1.1" x="0px" y="0px" width="12.781px" height="5.761px" viewBox="0 0 12.781 5.761" enableBackground="new 0 0 12.781 5.761" >
          <polygon fill="#000000" points="6.478,5.719 0.243,0.049 12.603,0.049 "/>
        </svg>
      </div>
    </div>
  );
};

export default PointerUpDown;