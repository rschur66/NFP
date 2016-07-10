import React, { Component } from 'react';
import dateformat           from "dateformat";
import { Link }             from 'react-router';
import PointerUpDown        from '../../elements/PointerUpDown.jsx';

export default class OrderHistoryItem extends Component {

  constructor(props){
    super(props);
      this.state = {
      showContent: false
    }
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  renderBooks(){
      if (!this.props.orderItem.books) return ( <h5 className="noPadding"/> );
      return this.props.orderItem.books.map((oBook , i)=>{
        return(
          <h5 key={i}><em>{oBook}</em></h5> 
        )
      });
    }

  render(){
    let cleanOrderDate = "",
        boxLink = ( <td className="noPadding"/> );

    if (this.props.orderItem.date_created){
      cleanOrderDate = dateformat( this.props.orderItem.date_created , "mm/dd/yyyy");
    }

    if (this.props.orderItem.books){
      boxLink = (
        <td className="titles">
          <Link to={'/my-box/' + this.props.orderItem.date_created} className="smallText">View Box</Link>
        </td>
      );
    }

    return(
      <li className="lineItem" onClick={() => this.toggleContent()}>
        <div className="col -w35"><h5>{cleanOrderDate}</h5></div>
        <div className="col -w55"><h5 className="caps">{this.props.orderItem.label}</h5></div>
        <div className="col -w5">
          <div className ={"collapseActions" + ((this.state.showContent) ? " expanded" : " collapsed")} >
            <PointerUpDown />
          </div>
        </div>
        <div className={"details" + ((this.state.showContent) ? " show": " hide")}>
          <table className="dataTable">
            <tbody>
              <tr>
                <td className="h5">Order Number</td>
                <td className="h6 alt">{this.props.orderItem.id}</td>
              </tr>
              <tr>
                <td className="titles">
                  {this.renderBooks()}
                </td>
              </tr>
              <tr className="separator">
                <td className="h5">Total</td>
                <td className="h6 alt">${this.props.orderItem.total}</td>
              </tr>
              <tr>
                {boxLink}
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    );
  }
}