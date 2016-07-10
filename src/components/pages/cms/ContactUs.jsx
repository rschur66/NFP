import React, { Component } from 'react';
import { Link }             from 'react-router';

export default class ContactUs extends Component{

  openOlark(){
    olark('api.box.expand');
  }
  render(){

    return(
      <div className="bodyContent help">
        <section className="secondaryBg center contactUs">
          <h1>We're here to help</h1>
          <img src="/img/bom/ill-custService.svg" />
          <div className="narrowContent">
            <table className="dataTable">
              <tbody>
                <tr>
                  <td className="h4">Email:</td>
                  <td  className="h4" colSpan="2"><a href="mailto:member.services@bookofthemonth.com" >member.services@bookofthemonth.com</a></td>
                </tr>
                <tr>
                  <td className="h4">Chat:</td>
                  <td className="h4"><a href="javascript:void(0);" onClick={this.openOlark.bind(this)}>Click here</a></td>
                  <td className="h4">M-F 9am-6pm</td>
                </tr>
                <tr>
                  <td className="h4">Phone:</td>
                  <td className="h4">1-888-784-2670</td>
                  <td className="h4">M-F 9am-6pm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="innerWrapper center FAQs">
          <h3>Frequently Asked Questions</h3>
          <div className="responsiveFrameWrapper">
            <iframe src="https://bookspan.desk.com/?b_id=8038" frameBorder="0" width="900" height="900"></iframe>
          </div>
        </section>
      </div>
    );
  }
}
