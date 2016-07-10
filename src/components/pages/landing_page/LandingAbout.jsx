import React from 'react';

const LandingAbout = () => {
  return(
     <section className="landingAbout innerWrapper checkerboard">
        <div className="square image forDesktop">
          <img src="/img/bom/ill-about.svg" />
        </div>
        <div className="square content">
          <h1>About Book Of The Month</h1>
          <h4>
            If you’re an avid reader, one thing is for certain: if you only shop the “bestseller” lists, you’re going to miss many of the best stories. That’s why we work hard to bring you the gems: well-written, immersive stories that transport you, give you thrills, and tug at your heartstrings. The books that are truly worth reading.
          </h4>
        </div>
        <div className="square image forMobile">
          <img src="/img/bom/ill-about.svg" />
        </div>
      </section>
  );
}
export default LandingAbout;