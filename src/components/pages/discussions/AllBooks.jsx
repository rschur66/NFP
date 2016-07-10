import React, { Component } from 'react';
import {connect}            from 'react-redux';
import { Link }             from 'react-router';

export default class AllBooks extends Component{

  constructor(){
    super();
    this.state = {}
  }

  renderList(){
    let storeTime = new Date(this.props.storeTime),
        previousMonth =  new Date( new Date().setMonth( storeTime.getMonth() - 1 )),
        prevPreviousMonth = new Date( new Date().setMonth( storeTime.getMonth() - 2 ));

    if( storeTime.getDate() >= this.props.mid_ship_date )
      previousMonth =  storeTime,
      prevPreviousMonth = new Date( new Date().setMonth( storeTime.getMonth() - 1 ));

    let notRestOfBooks = this.props.features[previousMonth.getFullYear() - 2015][previousMonth.getMonth()].featured
          .concat(this.props.features[prevPreviousMonth.getFullYear() - 2015][prevPreviousMonth.getMonth()].featured),
        restOfBooks = this.props.products.filter( x => notRestOfBooks.indexOf(x.id) === -1 ).sort( (a,b) => b.discussion_count - a.discussion_count);
    return restOfBooks.map((book)=>{
      return(
          <li key={book.id} >
            <Link to={"/discussions/product/" + book.id } activeClassName="active">
              <div className="col -w80"><span className="smallText">{book.title}</span></div>
              <div className="col -w20"><span className="smallText">({book.discussion_count})</span></div>
            </Link>
          </li>
        );
    });
  }

  render(){
    return(
      <div className="borderedBox menuBox">
        <h6 className="alt boxHeader">All Books</h6>
        <ul className="itemList">
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

function mapStatetoProps(state){
  return {
    'products': Object.values(state.products),
    'features': state.features,
    'mid_ship_date': state.storeData.ship_days[1] + 2,
    'storeTime': state.storeTime
  };
}

export default connect(mapStatetoProps)(AllBooks);
