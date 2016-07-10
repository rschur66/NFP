import React from 'react';
import {Link} from 'react-router';

const WhatsIncluded = () => {

  return(
    <section className="innerWrapper center whatsIncluded">
      <h4 className="alt">What's Included:</h4>
      <div className="col -w50 center">
        <div className="col -w50 center hardcover">
          <div className="image">
            <img src="/img/bom/ill-yourPick.svg" alt="Hardcover" />
          </div>
          <h5 className="alt">1 book of your choice each month</h5>
        </div>
        <div className="col -w50 center extraBooks">
          <div className="image">
            <img src="/img/bom/ill-addBook.svg" alt="Add Additional Books" />
          </div>
          <h5 className="alt">Add extra books for only $9.99 each</h5>
        </div>
      </div>
      <div className="col -w50 center">
        <div className="col -w50 center freeShip">
          <div className="image">
             <img src="/img/bom/ill-freeShip.svg" alt="Free Shipping" />
          </div>
          <h5 className="alt">Free Shipping</h5>
        </div>
        <div className="col -w50 center skip">
          <div className="image">
             <img src="/img/bom/ill-skipMonth.svg" alt="Skip Any Month" />
          </div>
          <h5 className="alt">Easily skip any month.</h5>
        </div>
      </div>
    </section>
  );
}
export default WhatsIncluded;