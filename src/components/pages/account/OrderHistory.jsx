import React, { Component } from 'react';
import { connect }          from 'react-redux'; 
import OrderHistoryItem     from './OrderHistoryItem.jsx';

class OrderHistory extends Component {

  constructor(props){
    super(props);
      this.state = {
      showContent: false
    }
  }

  renderSubscriptions(){
    return this.props.orderHistory.map((oOrder , i)=>{
      return(
        <OrderHistoryItem  key={i}  orderItem={oOrder} />
        )
    });
  }

  render(){
      let orders = (<div>No orders found.</div>);

      if (this.props.orderHistory.length >= 1){
        orders = (
          <div>
            <div className="dataTableHeader">
              <div className="col -w35"><h5 className="alt">DATE</h5></div>
              <div className="col -w55"><h5 className="alt">ITEM</h5></div>
            </div>
            <ul className="lineItemWrapper">
              {this.renderSubscriptions()}
            </ul>
          </div>
        );
      }

    return(
      <section className="orderHistory">
        <h1 className="sectionHeader">Order History</h1>
        {orders}
      </section>
    );
  }
}

function mapStateToProps(state){
  return {
    orderHistory : state.member.order_history
  }
}

export default connect(mapStateToProps)(OrderHistory);