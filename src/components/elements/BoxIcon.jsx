import React  from 'react';

const BoxIcon = (props) => {
  return(
    <div className="boxIcon">
    <div className="boxCount smallText">{props.boxCount}</div>
      <svg version="1.1" width="30.833px" height="29.167px" viewBox="69.167 67.5 30.833 29.167" enableBackground="new 69.167 67.5 30.833 29.167">
        <path fill="#11afe2" d="M83.494,81.586l-8.834-5.16l-4.795,4.85l8.769,5.48L83.494,81.586z M73.203,85.229v4.619l10.83,6.2V83.396
          l-5.397,4.974L73.203,85.229z M69.673,73.186l5,2.366l10.14-5.492l-5.373-1.941L69.673,73.186z M100,73.186l-9.766-5.067
          L84.86,70.06L95,75.552L100,73.186z M86.18,81.586l4.859,5.17l8.769-5.48l-4.795-4.85L86.18,81.586z M85.64,83.396v12.651
          l10.831-6.199v-4.62l-5.434,3.142L85.64,83.396z"/>
      </svg>
    </div>
  );
}

export default BoxIcon;