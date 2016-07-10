import React    from 'react';
import { Link } from 'react-router';

import Timeline           from './TimeLine.jsx';
import MagazinePromoBlock from '../magazine/MagazinePromoBlock.jsx';

const OurStory = () => {

  return(
    <div className="bodyContent ourStory">
      <section className="ourStoryHeader">
        <div className="innerWrapper center narrowContent">
          <h1>Our Story</h1>
          <h4>
            “Is there anything more satisfying than to keep abreast of the best new books of our time as they appear?
              In reading them, in enjoying them, in talking with others about them, we feel our day taking shape.”
          </h4>
          <h5><em>&mdash;Book of the Month Club</em> founding statement, 1926</h5>
        </div>
      </section>
      <Timeline />
      <section className="getStarted">
        <div className="innerWrapper center">
          <h1>Join us & participate in 90 years of literary heritage</h1>
          <h4 className="narrowContent">
            Find out what Book of the Month can do for your reading life. All plans include 1 hardcover book of your choice each month and free shipping.
          </h4>
          <div className="actionGroup">
            <Link to='enroll' className="button secondary">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OurStory;
