import {connect}            from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { editDiscussion } from '../../../modules/discussions';

export default class EditForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      form: {
        title: this.props.title,
        body: this.props.body
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.closeEditState = this.closeEditState.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if( this.props.body !== nextProps.body
      && this.props.title !== nextProps.title ) {
        let oUpdateForm = this.state.form;
        oUpdateForm['title'] = nextProps.title;
        oUpdateForm['body'] = nextProps.body;
        this.setState({form: oUpdateForm});
    }
  }

  handleChange(elem, event){
   event.preventDefault();
   let oUpdateForm = this.state.form;
   oUpdateForm[elem] = event.target.value;
   this.setState({form: oUpdateForm});
  }

  submitForm(evt){
    evt.preventDefault();
    if( this.state.body !== ''){
      this.props.editDiscussion( this.props.discussionId, this.state.form.body, this.state.form.title, this.props.params );
      this.props.toggleEditView();
    }
  }

  closeEditState(evt){
    evt.preventDefault();
    this.props.toggleEditView();
  }

  render(){
    let titleEdit = (!this.state.form.title) ? ('') : (
      <input
        type        = "text"
        onChange    = {this.handleChange.bind( this, 'title' )}
        value       = {this.state.form.title}
        required    = "required"
      />
    );
    
    return(
      <div className={"editForm" + ((this.props.editState) ? " expanded" : " ")}>

        <a className={"smallText" + ((this.props.editState) ? " hide" : " show")}  onClick={this.closeEditState.bind(this)}>Edit</a>
        <div className = {((this.props.editState) ? "show" : "hide")}>
          <form onSubmit={this.submitForm.bind(this)}>
            <fieldset>
              {titleEdit}
              <textarea
                onChange    = {this.handleChange.bind( this, 'body' )}
                value       = {this.state.form.body}
                required    = "required"
              />
            </fieldset>
            <div className="confirmationActions">
              <button className="primary">Save</button>
              <button className="secondary" onClick={this.closeEditState.bind(this)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ editDiscussion }, dispatch);
}

export default connect(null, mapDispatchToProps)(EditForm);
