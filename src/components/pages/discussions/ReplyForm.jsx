import {connect}            from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { createReply } from '../../../modules/discussions';

export default class ReplyForm extends Component{

  constructor(){
    super();
    this.state ={
      formIsShowing: false,
      body: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
   this.setState({ body: event.target.value });
  }

  toggleReplyForm(evt){
    evt.preventDefault();
    this.setState ({ formIsShowing : !this.state.formIsShowing });
  }

  submitForm(evt){
    evt.preventDefault();
    if( this.state.body !== ''){
      this.props.createReply( this.props.discussionId, this.state.body, this.props.params );
      this.setState ({ formIsShowing : !this.state.formIsShowing });
    }
  }

  render(){
    return(
      <div className={"replyForm" + ((this.state.formIsShowing) ? " expanded" : " ")}>

        <a className={"smallText" + ((this.state.formIsShowing) ? " hide" : " show")}  onClick={this.toggleReplyForm.bind(this)}>Reply</a>
        <div className = {((this.state.formIsShowing) ? "show" : "hide")}>
          <form onSubmit={this.submitForm.bind(this)}>
            <fieldset>
              <textarea
                onChange    = {this.handleChange.bind( this )}
                placeholder = "Reply"
                value       = {this.state.body}
                required    = "required"
              />
            </fieldset>
            <div className="confirmationActions">
              <button className="primary">Post</button>
              <button className="secondary" onClick={this.toggleReplyForm.bind(this)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ createReply }, dispatch);
}

export default connect(null, mapDispatchToProps)(ReplyForm);