import React from "react";

const CheckMark = () => {
  return(
    <div className="checkMark">
      <svg version="1.1"width="30px" height="30px" viewBox="0 0 30 30">
        <circle fill="#DBDBDF" cx="10" cy="10" r="10"/>
        <path fill="#FFFFFF" d="M15.271,5.246C14.9,4.953,14.362,5.017,14.07,5.388l-5.947,7.546l-3.028-2.295
          c-0.378-0.285-0.915-0.211-1.199,0.166c-0.285,0.375-0.211,0.913,0.165,1.198l3.53,2.676c0.423,0.4,1.065,0.307,1.457-0.152
          l6.365-8.078C15.706,6.076,15.643,5.539,15.271,5.246z"/>
      </svg>
    </div>
  );
};

export default CheckMark;