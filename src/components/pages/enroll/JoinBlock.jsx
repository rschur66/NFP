import React  from 'react';
import {Link} from 'react-router';


const JoinBlock = () => {
  return(
    <section className="JoinBlock">
      <div className="narrowContent center">
        <h1 className="knockout">Join the Club</h1>
        <h4 className="knockout">
          Find out what Book of the Month can do for your reading life. All plans include 1 hardcover book of your choice each month and free shipping.
        </h4>
        <div className="actionGroup">
          <Link to="/enroll" className="button secondary">GET STARTED</Link>
        </div>
      </div>
    </section>
  );
}
export default JoinBlock;
