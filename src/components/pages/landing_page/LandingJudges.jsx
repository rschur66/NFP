import React, { Component } from 'react';
import { Link }             from 'react-router';
import { connect }          from 'react-redux'; 
import { bindActionCreators } from 'redux';
import { showBook }           from '../../../modules/active_book';
import { push }               from 'react-router-redux'

class LandingJudges extends Component {

    constructor() {
      super();
      this.state = {
        activeJudge : false
      };
    }

  setActiveJudge(judge){
    this.setState({ activeJudge : judge });
  }

  triggerDefaultClick(id){
    let b = this.props.products[id];
    this.props.showBook(b);
    this.props.push('/' + b.title.toLowerCase().split(' ').join('-') + '-' + b.id);
  }

  renderJudges(){
    return this.props.meetJudges.map((judge)=>{
      return(
        <li className="sliderItem" key={judge.id} onClick={() => this.setActiveJudge(judge)}>
          <div className="judge">
            <img
              src={"/img/bom/feature_judges/" + judge.portrait}
              className={"judgeListImg" + ((this.state.activeJudge.id === judge.id)? ' active' : '')}  />
            <h5>{judge.name}</h5>
          </div>
        </li>
      );
    });
  }

  render() {

    let judgeAbstract = (
        <div className="content">
          <h1>Real Readers, Curated Selections</h1>
          <h4 className="knockout">
            Our Judges have one thing in common - a love of great books. 
            We’re proud of this amazing group of people, who work with our editorial 
            team to select and share their best book recommendations with our members.
          </h4>
        </div>
      );

    if(this.state.activeJudge){
      let oLink = '';
      if (this.state.activeJudge.isBookLink){
        oLink =(<h6 onClick={this.triggerDefaultClick.bind(this, this.state.activeJudge.linkpath)}>{this.state.activeJudge.link}</h6>)
      }else{
        oLink =(<Link className="h6" to={this.state.activeJudge.linkpath}>{this.state.activeJudge.link}</Link>)
      }
      if(this.state.activeJudge.template==='quote'){
        judgeAbstract = (
          <div className="content">
            <h1 dangerouslySetInnerHTML={{__html: this.state.activeJudge.headline}} />
            <h4 className="knockout" dangerouslySetInnerHTML={{__html: this.state.activeJudge.body}} />
            <div className="-w100">
             <div className="smallText knockout" dangerouslySetInnerHTML={{__html: this.state.activeJudge.byline}} />
              {oLink}
            </div>
          </div>
        );
      }else if(this.state.activeJudge.template==='video'){
        judgeAbstract = (
          <div className="content video">
            <div className="videoWrapper">
              <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + this.state.activeJudge.video + "?rel=0"} frameborder="0" allowfullscreen />
            </div>
            <h4 className="knockout" dangerouslySetInnerHTML={{__html: this.state.activeJudge.body}} />
            <div className="smallText knockout" dangerouslySetInnerHTML={{__html: this.state.activeJudge.byline}} />
            {oLink}
          </div>
        );
      }
    }

    return(
      <section className="landingJudges checkerboard noPadding"> 
        <div className="square left">
          <h1>MEET OUR JUDGES</h1>
            <div className="sliderWrapper">
              <ul className="sliderItemsContainer">
                {this.renderJudges()}
              </ul>
            </div>
            <Link className="h6" to="judges">View All Judges</Link>
        </div>
        <div className="square content right">
          {judgeAbstract}
        </div>
      </section>
    );
  }
}

function mapStateToProps(state){
  return { 
    meetJudges : state.meetJudges,
    products: state.products
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook, push }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingJudges);