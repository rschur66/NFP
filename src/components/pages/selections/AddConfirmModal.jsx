import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { Link }               from 'react-router';
import { bindActionCreators } from 'redux';


export default class AddConfirmModal extends Component {

  constructor(props){
    super(props);
    this.state ={
      viewErrorModal : this.props.viewErrorModal,
      confBook : {},
    }
  }


  errorModal(book = {}, eType){
    this.setState ({
      viewErrorModal : !this.state.viewErrorModal,
      confBook: book
    });
  }


  render(){
    let {member} = this.props,
        errorMessage = "",
        errorActions = "";

    if(member && !member.subscription){
      errorMessage = this.state.confBook.title + 'could not be selected because your membership plan failed to renew due to an invalid credit card. Please update your credit card to continue your membership';
      errorActions  = (<Link to="/renewal" className="button primary">Rejoin</Link> )
    }

    return(
      <div className="sliderWrapper selectionsList">
        <div className = {"modalWrapper" + ((this.state.viewErrorModal) ? ' showing' : '')}>
          <div className="confirmation modal">
            <div className="modalClose" onClick={this.errorModal.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <div className="center botmSwitchConf">
              <img src={ this.state.confBook.img ? "http://s3.amazonaws.com/botm-media/covers/167x250/" + this.state.confBook.img : "#" } />
              <h5>{errorMessage}</h5>
              <div className="confirmationActions"> {errorActions} </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    member: state.member,
    products : state.products
  };
}

// function mapDispatchToProps(dispatch){
//   return bindActionCreators({ hideBook }, dispatch)
// }

export default connect(mapStateToProps)(AddConfirmModal);