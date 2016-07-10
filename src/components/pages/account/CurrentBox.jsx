import React, {Component}   from "react";
import {connect}            from "react-redux";
import {removeFromBox}      from "../../../modules/member_box";
import {bindActionCreators} from "redux";
import {push}               from "react-router-redux";
import PriceSummary         from "./PriceSummary.jsx";
import dateformat           from "dateformat";

export default class CurrentBox extends Component {

  constructor(props){
    super(props);
  }

  renderSwagList(){
    let { products, can_pick, store_can_pick, box_obj } = this.props;
    let swagItems = box_obj.swag.map( x => products[x] );

    if(store_can_pick && can_pick){
      return swagItems.map( (oItem, i) => {
        return(
          <div className="boxItemHolder" key={i}>
            <img src={"//s3.amazonaws.com/botm-media/swag/" + oItem.img } className="boxItem botm full" />
            <button className="secondary alt narrow" onClick={() => this.props.removeFromBox(oItem.id)}>Remove</button>
          </div>
        );
      });
    } else {
      return swagItems.map( (oItem, i) => {
        return(
          <div className="boxItemHolder" key={i}>
            <img src={"//s3.amazonaws.com/botm-media/swag/" + oItem.img } className="boxItem botm full" />
          </div>
        );
      });
    }

  }

  render(){
    let { can_pick, store_can_pick, date, ship_date, box_obj, products} = this.props;
    let isSkipped = box_obj.books[0] ? false : true;
    let books = box_obj.books ? box_obj.books.map( x => products[x] ) : [];
    let actionMessage = "";
    let actionImage = "";
    let BOTMaction = "";
    let bookView = "";
    let swag = '';
    let BOTMpick = (
      <div className="boxItem botm" >
        <div><span className="smallText">Pick your BOTM</span></div>
      </div>
    );
    let additionalBook1 = (
      <div className="boxItemHolder" onClick={()=> this.props.push('/more-books')}>
        <div className="boxItem"></div>
      </div>
    );
    let additionalBook2 = (
      <div className="boxItemHolder" onClick={()=> this.props.push('/more-books')}>
        <div className="boxItem"></div>
      </div>
    );

    if (box_obj.swag.length > 0)
      swag = (
        <div className="swagWrapper center">
          <h5 className="alt">Totes & more</h5>
          {this.renderSwagList()}
        </div>
      );

    if (store_can_pick && can_pick) {
      BOTMaction = (<button className="secondary alt narrow" onClick={() => this.props.push('/my-botm')}>{books[0] ? 'Change' : 'Add'}</button>);
      actionImage="ill-yourPick.svg";
      actionMessage = (
        <h5 className="alt">
          The {dateformat( new Date(date), "mmmm")} Selections have arrived! Select your BOTM and your box will ship {dateformat( new Date(ship_date), "mmmm dS")}.
        </h5>
      );
    } else if(!can_pick){
      actionMessage = (<h5 className="alt">Your {dateformat( date, "mmmm")} box shipped on {dateformat( box_obj.date_shipped, "mmmm dS, yyyy")}. Happy Reading!</h5>);
      actionImage = "ill-freeShip.svg";
    }
    if (isSkipped){
      actionImage="ill-skipMonth.svg";
      actionMessage = (<h5 className="alt">You Skipped This Month.</h5>);
    }

    if(books[0])
      BOTMpick = (<img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[0].img } className="boxItem botm full" />);
    if(books[1]){
      let additionalAction = (<div />);
      if(store_can_pick && can_pick)
        additionalAction = (<button className="secondary alt narrow" onClick={() => this.props.removeFromBox(books[1].id)}>Remove</button>);
      additionalBook1 = (
        <div className="boxItemHolder">
          <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[1].img } className="boxItem botm full" />
          {additionalAction}
        </div>
      );
    }
    if(books[2]){
      let additionalAction = (<div />);
      if(store_can_pick && can_pick)
        additionalAction = (<button className="secondary alt narrow" onClick={() => this.props.removeFromBox(books[2].id)}>Remove</button>);
      additionalBook2 = (
        <div className="boxItemHolder">
          <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[2].img } className="boxItem botm full" />
          {additionalAction}
        </div>
      );
    }

    if( isSkipped && (!store_can_pick || !can_pick) ) //skipped and picking over
      bookView = (
        <section className="boxItems">
          <div className="boxItemWrapper pastBooks">
            <h5>{"My BOTM"}</h5>
            <div className="boxItemHolder">
              <div className="boxItem botm">
                <div><span className="smallText">{"You didn't pick a BOTM"}</span></div>
              </div>
            </div>
          </div>
        </section>
      );
    else  // picking not over, skipped or not
      bookView = (
        <section className="boxItems">
          <div className="boxItemWrapper BOM">
            <h5 className="alt">My BOTM</h5> 
            <div className="boxItemHolder">
              {BOTMpick}
              {BOTMaction}
            </div>
          </div>
          <div className="boxItemWrapper additionalBooks ">
            <h5 className="alt">Add up to 2 more books for $9.99 each</h5>
            {additionalBook1}
            {additionalBook2}
          </div>
          {swag}
        </section>
      );

    return(
      <div>
          <section className="boxMessage">
            <img className="col -w20" src={"/img/bom/" + actionImage } />
            <div className="col">{actionMessage}</div>
          </section>
          {bookView}
          <div className="boxInfoSummary">
            <div className="boxSummaryHeader">
              <h6 className="alt">My Statement:&nbsp;</h6>
              <h6>{dateformat( date, "mmmm yyyy")}</h6>
            </div>
            <PriceSummary
              box_obj={box_obj}
              boxTimePeriod="current" />
          </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    'store_can_pick': state.storeData.can_pick,
    'ship_date': state.storeData.ship_date,
    'box': state.member.box,
    'products': state.products
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ removeFromBox, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBox);