import React from 'react';

const LandingAbout = () => {

let landingAbout = { marginTop: '40px'};

  return(
     <section className="landingAbout center innerWrapper" style={landingAbout}>

      <h1>Less Searching, More Reading</h1>

      <ul className="gridBoxes">
        <li className="col center" >
          <div>
            <img src="img/bom/ill-curated.svg" alt="Curated" />
          </div>
          <h5 className="alt">FIVE RECOMMENDATIONS</h5>
          <h5>Every month we announce five new selections, carefully chosen by our judges.</h5>
        </li>
        <li className="col center">
          <div>
            <img src="/img/bom/ill-yourPick.svg" alt="Your Choice" />
          </div>
          <h5 className="alt">THE CHOICE IS YOURS</h5>
          <h5>One book of your choice included in your membership each month.</h5>
        </li>
        <li className="col center">
          <div>
             <img src="/img/bom/ill-freeShip.svg" alt="Free Shipping" />
          </div>
          <h5 className="alt">FREE SHIPPING</h5>
          <h5>We ship your box straight to your door for free&mdash;always.</h5>
        </li>
        <li className="col center">
          <div>
            <img src="/img/bom/ill-addBook.svg" alt="Add Additional Books" />
          </div>
          <h5 className="alt">ADD MORE BOOKS</h5>
          <h5>Get two more books in your monthly box for just $9.99 each.</h5>
        </li>
        <li className="col -w33 center">
          <div>
            <img src="/img/bom/ill-skipMonth.svg" alt="Skip Any Month" />
          </div>
          <h5 className="alt">SKIP ANY MONTH</h5>
          <h5>Enjoy a flexible membership and easily skip any month.</h5>
        </li>
      </ul>

    </section>
  );
}
export default LandingAbout;