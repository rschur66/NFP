import React, { Component }           from 'react';
import { connect }              from 'react-redux';
import CreateAccountInfo              from '../../elements/CreateAccountInfo.jsx';
import { get }                        from '../../../svc/utils/net';


class EnrollAccountInfo extends Component {

  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/5`);
    });
  }

  render(){
    return (<div className="bodyContent">
      <section className="innerWrapper center">
        <h6>Step 5</h6>
        <div className="enrollAccountInfo">
          <h1>Almost there</h1>
          <h4>Please enter your information below to join.</h4>

          <CreateAccountInfo />
        </div>
      </section>
    </div>);
  }
}

function mapStateToProps(state){
  return { experiment: state.experiment  };
}


export default connect(mapStateToProps)(EnrollAccountInfo);