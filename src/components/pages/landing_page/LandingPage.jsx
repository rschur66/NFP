import React, { Component }   from 'react';
import { Link }               from 'react-router';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { get }                from '../../../svc/utils/net';
import { showBook }           from '../../../modules/active_book';
import LandingAbout           from './LandingAbout.jsx';
import LandingJudges          from './LandingJudges.jsx';
import LandingHeroes          from './LandingHeroes.jsx';
import LandingHeroesExp1826   from './LandingHeroesExp1826.jsx';
import MagazinePromoBlock     from '../magazine/MagazinePromoBlock.jsx';
import LandingMembers         from './LandingMembers.jsx';
import JoinBlock              from '../../pages/enroll/JoinBlock.jsx';
import SelectionsListNM       from '../selections/SelectionsListNM.jsx';
import SelectionDetails       from '../selections/SelectionDetails.jsx';
import DetailsMobile          from '../selections/DetailsMobile.jsx';


export default class LandingPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      activeModal : '',
      activeHero : 1,
    };
    this.toggleModal        = this.toggleModal.bind(this);
    this.setActiveSelection = this.setActiveSelection.bind(this);
  }

  toggleModal(sType) {
    let sCurrentType = this.state.activeModal;
    if (sCurrentType.toString() === sType.toString()) sType = '';
    this.setState({
      activeModal: sType,
      activeSelection: []
    });
  }

  setActiveSelection(book){
    this.setState({ activeSelection: book });
  }

  componentDidMount(){
    this.props.experiment.forEach(exp => {
      get(`/svc/experiment/${exp.id}/0`);
    });
  }
  componentWillMount(){
    let { book } = this.props.params,
        storeTime  = new Date(this.props.storeTime);
    if (this.props.params.hero){
      this.setState({
        activeHero : (parseInt(this.props.params.hero) <=3 )? this.props.params.hero : 1,
      });
    }
    if( book ){
      let book_id = parseInt(book.substr(book.lastIndexOf('-') + 1));
      if( !isNaN(book_id) && typeof book_id === "number" && this.props.products[book_id]
         && this.props.features[storeTime.getFullYear() - 2015][storeTime.getMonth()].featured.indexOf(book_id) > -1 )
        this.props.showBook(this.props.products[book_id]);
    }
  }
  render(){
    let landingHeros = ( this.props.experiment[0].version === 0) ? <LandingHeroes activeHero={this.state.activeHero} /> : <LandingHeroesExp1826 activeHero={this.state.activeHero} />;
    return (
      <div className="bodyContent landingPage">
          <SelectionDetails />
          <DetailsMobile />
          {landingHeros}
          <LandingAbout />
          <section className="center selections">
            <h1>Current Selections</h1>
            <h4>Click a book to read what the judge has to say</h4>
            <SelectionsListNM toggleModal={this.toggleModal} setActiveSelection={this.setActiveSelection} />
            <Link to="about-selections" className="h6">Learn More About Our Selections</Link>
          </section>
          <LandingJudges />
          <LandingMembers />
          <JoinBlock />
      </div>
    );
  }
}


function mapStateToProps(state){
  return {
    products  : state.products,
    features  : state.features,
    storeTime : state.storeTime,
    experiment: state.experiment
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);