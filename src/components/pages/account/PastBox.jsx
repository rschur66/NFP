import React, { Component }   from 'react';
import { connect }              from 'react-redux';
import PriceSummary from './PriceSummary.jsx';
import dateformat from "dateformat";

export default class PastBox extends Component {

  constructor(props){
    super(props);
  }

  renderSwagList(){
    let { products, box_obj } = this.props;
    let swagItems = box_obj.swags ? box_obj.swags.map( x => products[x] ) : [];
    return swagItems.map( (oItem, i) => {
      return(
        <div className="boxItemHolder" key={i}>
          <img src={"//s3.amazonaws.com/botm-media/swag/" + oItem.img } className="boxItem botm full" />
        </div>
      );
    });
  }

  render(){
    let { date, box_obj, products } = this.props,
        books = box_obj && box_obj.books ? box_obj.books.map( x => products[x] ) : [],
        swags = box_obj && box_obj.swags ? box_obj.swags.map( x => products[x] ) : [],
        isSkipped = books.length === 0 || !box_obj || !box_obj.date_shipped,
        actionMessage = ( <h5 className="alt">You Skipped This Month.</h5> ),
        actionImage = "ill-skipMonth.svg",
        additionalBook1 = (<div />),
        additionalBook2 = (<div />),
        subtitle = "",
        swag = '',
        BOTMpick = (
        <div className="boxItemHolder">
          <div className="boxItem botm">
            <div><span className="smallText">{"You didn't pick a BOTM"}</span></div>
          </div>
        </div>
      );

    if (swags.length > 0)
      swag = (
        <div className="swagWrapper center">
          <h5 className="alt">Totes & more</h5>
          {this.renderSwagList()}
        </div>
      );

    if (!isSkipped) {
      actionImage = "ill-freeShip.svg";
      actionMessage = (<h5 className="alt">Your {dateformat( date, "mmmm" )} box shipped on {dateformat( new Date(box_obj.date_shipped), "mmmm dS, yyyy" )}. Happy Reading!</h5>);
      if(books[0])
        BOTMpick = (
          <div className="boxItemHolder">
            <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[0].img } className="boxItem botm full" />
          </div>
        );
      if(books[1]){
        subtitle = " and +1 additional book";
        additionalBook1 = (
            <div className="boxItemHolder">
              <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[1].img } className="boxItem botm full" />
            </div>
        );
      }
      if(books[2]){
        subtitle = " and +2 additional book";
        additionalBook2 = (
            <div className="boxItemHolder">
              <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[2].img } className="boxItem botm full" />
            </div>
        );
      }
    }

    return(
      <div>
        <section className="boxMessage">
          <img className="col -w20" src={"/img/bom/" + actionImage } />
          <div className="col">{actionMessage}</div>
        </section>

        <section className="boxItems">
          <div className="boxItemWrapper pastBooks">
            <h5 className="alt">{"My BOTM" + subtitle}</h5>
            {BOTMpick}
            {additionalBook1}
            {additionalBook2}
          </div>

          {swag}

        </section>

        <div className="boxInfoSummary">

          <div className="boxSummaryHeader">
            <h6 className="alt">My Statement:&nbsp;</h6>
            <h6>{dateformat( date, "mmmm yyyy" )}</h6>
          </div>

          <PriceSummary
            box_obj={box_obj}
            boxTimePeriod="past" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    'products': state.products,
    'box': state.member.box
  }
}

export default connect(mapStateToProps)(PastBox);