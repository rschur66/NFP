import React, { Component }   from 'react';
import { Link }               from 'react-router';
import { connect }            from 'react-redux';
import { removeFromBox }      from '../../../modules/member_box';
import { bindActionCreators } from 'redux';
import PriceSummary           from './PriceSummary.jsx';
import dateformat             from "dateformat";

export default class FutureBox extends Component {

  constructor(props){
    super(props);
  }

  renderSwagList(){
    let {products, box_obj } = this.props;
    let swagItems = box_obj.swag.map( x => products[x] );
    return swagItems.map( (oItem, i) => {
      return(
        <div className="boxItemHolder" key={i}>
          <img src={"//s3.amazonaws.com/botm-media/swag/" + oItem.img } className="boxItem botm full" />
          <button className="secondary alt narrow" onClick={() => this.props.removeFromBox(oItem.id)}>Remove</button>
        </div>
      );
    });
  }

  render(){

    let { box_obj, date, box_history, ship_date, products } = this.props;
    let books = box_obj && box_obj.books ? box_obj.books.map( x => products[x] ) : [];
    let swag = '';
    let BOTMpick = (
      <div className="boxItem botm">
        <div><span className="smallText">Pick your BOTM on {dateformat( date, "mmmm" )} 1st</span></div>
      </div>
    );
    let additionalBook1 = (
      <div className="boxItemHolder">
        <div className="boxItem"></div>
      </div>
    );
    let additionalBook2 = (
      <div className="boxItemHolder">
        <div className="boxItem"></div>
      </div>
    );
    let actionImage="ill-calendar.svg";
    let actionMessage = (
      <h5 className="alt">
        Choose your next Book of the Month on {dateformat( date, "mmmm" )} 1 when our new selections are announced.&nbsp;&nbsp;
        <Link to="learn-more"> Learn More.</Link>
      </h5>
    );

    if (box_obj.swag.length > 0)
      swag = (
        <div className="swagWrapper center">
          <h5 className="alt">Totes & more</h5>
          {this.renderSwagList()}
        </div>
      );
    if(books[1])
      additionalBook1 = (
        <div className="boxItemHolder">
          <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[1].img } className="boxItem botm full" />
          <button className="secondary alt narrow" onClick={() => this.props.removeFromBox(books[1].id)}>Remove</button>
        </div>
      );
    if(books[2])
      additionalBook2 = (
        <div className="boxItemHolder">
          <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + books[2].img } className="boxItem botm full" />
          <button className="secondary alt narrow" onClick={() => this.props.removeFromBox(books[2].id)}>Remove</button>
        </div>
      );

    return(
      <div>
          <section className="boxMessage">
            <img className="col -w20" src={"/img/bom/" + actionImage } />
            <div className="col">{actionMessage}</div>
          </section>

          <section className="boxItems">
            <div className="boxItemWrapper BOM">
              <h5 className="alt">My BOTM</h5>
              <div className="boxItemHolder">
                {BOTMpick}
              </div>
            </div>
            <div className="boxItemWrapper additionalBooks ">
              <h5 className="alt">Add up to 2 more books for $9.99 each</h5>
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
              books={books}
              boxTimePeriod="future" />
          </div>
      </div>
    );
  }
}
function mapStateToProps(state){
  return { 
    'ship_date': state.storeData.ship_date,
    'box': state.member.box,
    'products': state.products
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ removeFromBox }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FutureBox);