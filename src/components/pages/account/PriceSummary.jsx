import React, {Component} from "react";
import {connect} from "react-redux";

export default class PriceSummary extends Component {

  constructor(props){
    super(props);
  }

  renderSwagList(){
    let { products } = this.props;
    let swagItems = this.props.box_obj.swag.map( x => products[x] );
    return swagItems.map( (oItem, i) => {
      return(
        <tr key={i}>
          <td className="h5">{oItem.title}</td>
          <td className="h6 alt">${oItem.price}</td>
        </tr>
      );
    });
  }


  render(){
  	let { box_obj, credits, products, boxTimePeriod} = this.props,
        tax = "0.00",
        total = "0.00",
        subtotal = box_obj.prices && box_obj.swag_prices ? [...box_obj.prices, ...box_obj.swag_prices].reduce( (a,b) => a+b ) : 0,
        book0 = (<tr />),
        book1 = (<tr />),
        book2 = (<tr />),
        books = box_obj.books ? box_obj.books.map( x => products[x] ) : [],
        swagElm  = (<tbody><tr /></tbody>),
        currentCredits = boxTimePeriod === "past" ? box_obj.credits : [ 0, credits > 0 ? 1 : 0, credits > 1 ? 1 : 0 ];

    if( subtotal ) {
      subtotal -= (currentCredits[2] && books.length == 3) ? 19.98 : (currentCredits[1] ? 9.99 : 0);
      tax = Math.round((subtotal * this.props.tax_rate) * 100) / 100;
      total = Math.round((subtotal + tax) * 100) / 100;
    }

  	if( books[0] )
  		book0 = (
  			<tr>
          <td className="h5"><em>{books[0].title}</em></td>
          <td className="h6 alt">INCLUDED</td>
        </tr>
  		);

  	if( books[1] )
  		book1 = (
  			<tr>
          <td className="h5"><em>{books[1].title}</em></td>
          <td className="h6 alt">{currentCredits[1] > 0 ? "1 CREDIT" :"$" + box_obj.prices[1] }</td>
        </tr>
  		);

  	if( books[2] )
  		book2 = (
  			<tr>
          <td className="h5"><em>{books[2].title}</em></td>
          <td className="h6 alt">{currentCredits[2] ? "1 CREDIT" :"$" + box_obj.prices[2]}</td>
        </tr>
  		);

    if( box_obj.swag && box_obj.swag.length > 0)
      swagElm = (
        <tbody>
          {this.renderSwagList()}
        </tbody>
      );

  	return (
  		<section>
        <table className="dataTable">
          <tbody>
           	{book0}
           	{book1}
           	{book2}
          </tbody>
        </table>

        <table className="dataTable">
            {swagElm}
        </table>

          <table className="dataTable">
          <tbody>
            <tr>
              <td className="h5">Shipping</td>
              <td className="h6 alt">FREE</td>
            </tr>
            <tr>
              <td className="h5">Tax</td>
              <td className="h6 alt">${tax}</td>
            </tr>
            <tr className="separator">
              <td className="h5">Total</td>
              <td className="h6 alt">${total}</td>
            </tr>
          </tbody>
        </table>
      </section>
  	);
  }
}

function mapStateToProps(state){
  return { 
    'tax_rate': state.member.tax_rate, 
    'credits': state.member.credits,
    'box':   state.member.box,
    'products': state.products
  }
}

export default connect(mapStateToProps)(PriceSummary);