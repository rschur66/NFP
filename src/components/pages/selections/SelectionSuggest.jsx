import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { get }                from '../../../svc/utils/net';

export default class SelectionSuggestion extends Component {

  constructor(props){
    super(props);
    this.state = {
      suggestion : '',
      suggestionSent: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.captureSuggestion = this.captureSuggestion.bind(this);
  }

  captureSuggestion( evt ) {
    evt.preventDefault();
    let sAddSuggestion = this.state.suggestion, 
        nMemberID = this.props.member.id,
        self = this;
    get( '/svc/member/selectionSuggestion?suggestion=' + sAddSuggestion + '&member=' + nMemberID ).then(() => {
      self.setState({suggestionSent: true});
    });
  }

  handleChange( event ){
    this.setState({ suggestion: event.target.value });
  }

  toggleContent(){ this.setState ({ showContent : !this.state.showContent }); }

  render() {
    let name = this.props.member ? this.props.member.first_name : '',
        plusMinus = (this.state.showContent) ? '-' : '+';

    if(this.state.suggestionSent) return (<div className=""><h5 className="highlightColor">Thank you, {name}!</h5></div>);

    return(
      <div className="">



        <div className="expanderWrapper" onClick={this.toggleContent.bind(this)}>
          <h5 className="alt highlightColor">Have a suggestion for our "Other Favorites" list? {plusMinus}</h5>
        </div>

        <div className={"toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>

          <form onSubmit={this.captureSuggestion}>
            <div className="fieldsWrapper">
              <input
                type        = "text"
                required    = "required"
                placeholder = "Suggested title"
                value       = {this.state.value}
                onChange    = {this.handleChange}
              />
              <button className="primary">Submit</button>
            </div>
          </form>

        </div>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    content : state.content,
    member  : state.member,
  };
}

export default connect(mapStateToProps)(SelectionSuggestion);