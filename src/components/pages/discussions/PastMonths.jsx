import React, { Component } from 'react';
import {connect}            from 'react-redux';
import { Link }             from 'react-router';
import dateformat from "dateformat";

export default class PastMonths extends Component{

  constructor(){
    super();
    this.state = {};
  }

  renderBooks(books){
    return books.map((book_id) => {
        return (
           <li key={book_id}>
            <Link to={"/discussions/product/" + book_id } activeClassName="active">
              <div className="col -w80"><span className="smallText">{this.props.products[book_id].title}</span></div>
              <div className="col -w20"><span className="smallText">({this.props.products[book_id].discussion_count})</span></div>
            </Link>
          </li>
        );
    });
  }

  render(){
    let month0, month1, month0Feat, month1Feat, month0DiscCount, month1DiscCount,
     storeTime = new Date(this.props.storeTime);
    if( storeTime.getDate() >= this.props.mid_ship_date ){
      month0 = storeTime,
      month1 = new Date( new Date().setMonth( storeTime.getMonth() - 1 ) ),
      month0Feat = this.props.features[month0.getFullYear() - 2015][month0.getMonth()].featured,
      month1Feat = this.props.features[month1.getFullYear() - 2015][month1.getMonth()].featured,
      month0DiscCount = month0Feat.map( x => this.props.products[x].discussion_count).reduce( (a,b) => a + b ),
      month1DiscCount = month1Feat.map( x => this.props.products[x].discussion_count).reduce( (a,b) => a + b );
    } else {
      month0 = new Date( new Date().setMonth( storeTime.getMonth() - 1 ) ),
      month1 = new Date( new Date().setMonth( storeTime.getMonth() - 2 ) ),
      month0Feat = this.props.features[month0.getFullYear() - 2015][month0.getMonth()].featured,
      month1Feat = this.props.features[month1.getFullYear() - 2015][month1.getMonth()].featured,
      month0DiscCount = month0Feat.map( x => this.props.products[x].discussion_count).reduce( (a,b) => a + b ),
      month1DiscCount = month1Feat.map( x => this.props.products[x].discussion_count).reduce( (a,b) => a + b );
    }

    return(
      <div className="borderedBox menuBox">

        <div className="boxHeader">
          <Link to={"/discussions/month/" + month0.getFullYear() + "/" + month0.getMonth() } activeClassName="active">
            <div className="col -w80"><h6 className="alt">{dateformat( month0, "mmmm" )}</h6></div>
            <div className="col -w20"><span className="smallText">({month0DiscCount})</span></div>
          </Link>
        </div>

        <ul className="itemList">
          {this.renderBooks(month0Feat)}
        </ul>

        <div className="boxHeader">
          <Link to={"/discussions/month/" + month1.getFullYear() + "/" + month1.getMonth() } activeClassName="active">
            <div className="col -w80"><h6 className="alt">{dateformat( month1, "mmmm" )}</h6></div>
            <div className="col -w20"><span className="smallText">({month1DiscCount})</span></div>
          </Link>
        </div>

        <ul className="itemList">
          {this.renderBooks(month1Feat)}
        </ul>

      </div>
    );
  }
}


function mapStatetoProps(state){
  return {
    'products': state.products,
    'features': state.features,
    'mid_ship_date': state.storeData.ship_days[1] + 2,
    'storeTime': state.storeTime
  };
}

export default connect(mapStatetoProps)(PastMonths);