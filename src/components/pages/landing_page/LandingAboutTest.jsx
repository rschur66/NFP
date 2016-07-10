import React     from 'react';
import { Link }  from 'react-router';

const LandingAbout = () => {
  return(
     <section className="landingAbout innerWrapper checkerboard">
        <div className="square image forDesktop">
          <img src="/img/bom/ill-about.svg" />
        </div>
        <div className="square content">
          <h1>ABOUT BOTM</h1>
          <h4>
            We work hard to bring you the gems: well-written, 
            immersive stories that transport you, give you thrills, and tug at your heartstrings. 
            The books that are truly worth reading.
          </h4>
          <Link className="button primary" to="learn-more">Learn More</Link>
        </div>
        <div className="square image forMobile">
          <img src="/img/bom/ill-about.svg" />
        </div>
      </section>
  );
}
export default LandingAbout;