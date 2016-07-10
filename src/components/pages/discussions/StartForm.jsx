import React, { Component } from 'react';
import {connect}            from 'react-redux';
import { createDiscussion } from '../../../modules/discussions';
import { bindActionCreators } from 'redux';

export default class StartForm extends Component{
   constructor(props){
    super(props);
    this.state = {
      form: {
        book: Object.values(props.products)[0].id,
        title: '',
        body: ''
      },
      error: null
    }
    this.handleChange     = this.handleChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.validateForm     = this.validateForm.bind(this);
    this.createDiscussion = this.createDiscussion.bind(this);
  }

  handleChange(elem, event){
    event.preventDefault();
    let oUpdateForm = this.state.form;
    oUpdateForm[elem] = event.target.value;
    this.setState({form: oUpdateForm});
  }

  handleModalClose(){
    this.setState({
      form: {
        book: Object.values(this.props.products)[0].id,
        title: '',
        body: ''
      },
      error: null
    });
    this.props.toggleDiscussionForm();
  }

  validateForm(){
    if( this.state.form.book === '')
      this.setState({ error: "Please select a book to create a discussion about."});
    else if( this.state.form.title === '' )
      this.setState({ error: "Please add a title for this discussion."});
    else if( this.state.form.body === '' )
      this.setState({ error: "Please add a body for this discussion."});
    else return true;
    return false;
  }

  createDiscussion(evt){
    evt.preventDefault();
    if( this.validateForm()){
      this.props.createDiscussion(this.state.form);
      this.handleModalClose();
    }
  }

  render(){
    let oError = this.state.error ? (<p className="error">{this.state.error}</p>) : (<div></div>);
    return(
      <div className = {"modalWrapper " + ((this.props.startDiscussionState) ? " showing" : " ")}>
        <div className="backArrow -forDetails" onClick={() => this.handleModalClose('')}>
          <svg version="1.1" id="Layer_2" x="0px" y="0px" width="27.438px" height="21.382px" viewBox="0 0 27.438 21.382" enableBackground="new 0 0 27.438 21.382">
            <polygon fill="#FFFFFF" points="27.438,8.791 6.275,8.791 11.186,3.88 9.064,1.759 0.502,10.318 9.064,18.88 11.186,16.759 6.217,11.791
            27.438,11.791 "/>
          </svg>
        </div>
        <div className="modal">
          <h4 className="alt">Start A discussion</h4>
          {oError}
          <form onSubmit={this.createDiscussion.bind(this)}>
            <fieldset>
              <div className="selectWrapper">
                <select
                  onChange     = {this.handleChange.bind( this, 'book' )}
                  required     = "required"
                  value        = {this.state.form.book}
                  defaultValue = ""
                >
                  {Object.values(this.props.products).map( (x, i) => (<option value={x.id} key={i+x.id}>{x.title}</option>) )}
                </select>
              </div>
              <input
                type        = "text"
                onChange    = {this.handleChange.bind( this, 'title' )}
                placeholder = "Title"
                value       = {this.state.form.title}
                required    = "required"
              />
              <textarea
                onChange    = {this.handleChange.bind( this, 'body' )}
                placeholder = "Body"
                value       = {this.state.form.body}
                required    = "required"
              />
            </fieldset>
            <div className="confirmationActions">
              <button className="primary">Create Post</button>
              <button className="secondary" onClick={this.handleModalClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}



function mapStatetoProps(state){
  return { 'products': state.products };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ createDiscussion }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(StartForm);
