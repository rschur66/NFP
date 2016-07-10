import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchWeather} from '../actions/index';

class SearcBar extends Component {
   
  constructor(props){
    super(props);
    this.state = { term : '' }
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleChange(e){
    this.setState({
      term : e.target.value
    });
  }

  onFormSubmit(e){
    e.preventDefault();
    //call action creator
    this.props.fetchWeather(this.state.term);
    this.setState({ term:''});//Just to clear input field
  }

  render(){

    return(
      <form onSubmit={this.onFormSubmit}>
        search
        <input 
        placeholder="Get Forecast"
        value={this.state.term}
        onChange={this.handleChange}
        />
        <button type="submit">submit</button>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchWeather}, dispatch);
}

export default connect(null, mapDispatchToProps) (SearcBar);
/*NOTE: mapDispatchToProps has to be second arg. So, since we are not passing 'state' here
we pass 'null' as first arg.*/
