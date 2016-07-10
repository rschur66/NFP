/* *******************************
This is the logged out page that
details monthly selections
********************************** */

import React, {Component}  from 'react';
import { Link }            from 'react-router';

import EmailCapture        from '../../elements/EmailCapture.jsx';
import JoinBlock           from '../../pages/enroll/JoinBlock.jsx';
import SelectionDetails    from './SelectionDetails.jsx';
import DetailsMobile       from './DetailsMobile.jsx';
import SelectionsListNM    from './SelectionsListNM.jsx';
import dateformat           from "dateformat";
import { connect }         from 'react-redux';
import { bindActionCreators } from 'redux';
import { showBook }           from '../../../modules/active_book';


export default class PageAboutSelections extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeModal : '',
      currentFeatured: 0
    };

    let month0 = new Date(props.storeTime),
        month1 = new Date( new Date().setMonth( month0.getMonth() - 1 ) ),
        month2 = new Date( new Date().setMonth( month0.getMonth() - 2 ) ),
        month3 = new Date( new Date().setMonth( month0.getMonth() - 3 ) ),
        month4 = new Date( new Date().setMonth( month0.getMonth() - 4 ) ),
        month0Feat = props.features[month0.getFullYear() - 2015][month0.getMonth()],
        month1Feat = props.features[month1.getFullYear() - 2015][month1.getMonth()],
        month2Feat = props.features[month2.getFullYear() - 2015][month2.getMonth()],
        month3Feat = props.features[month3.getFullYear() - 2015][month3.getMonth()],
        month4Feat = props.features[month4.getFullYear() - 2015][month4.getMonth()];

    this.selectMatch = {
      0: { month: dateformat( month0, "mmmm" ), featured: month0Feat.featured, percents: month0Feat.percents },
      1: { month: dateformat( month1, "mmmm" ), featured: month1Feat.featured, percents: month1Feat.percents },
      2: { month: dateformat( month2, "mmmm" ), featured: month2Feat.featured, percents: month2Feat.percents },
      3: { month: dateformat( month3, "mmmm" ), featured: month3Feat.featured, percents: month3Feat.percents },
      4: { month: dateformat( month4, "mmmm" ), featured: month4Feat.featured, percents: month4Feat.percents },
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
    this.setState({
      activeSelection: book
    });
  }

  componentWillMount(){
    let { book } = this.props.params;
    if( book ){
      let book_id = parseInt(book.substr(book.lastIndexOf('-') + 1));
      if( !isNaN(book_id) && typeof book_id === "number" && this.props.products[book_id] )
        this.props.showBook(this.props.products[book_id]);
    }
  }

  handleSelectChange(event){
    this.setState({ currentFeatured: parseInt(event.target.value) });
  }

  render(){
    return(
      <div className="bodyContent aboutSelections">
        <SelectionDetails />
        <DetailsMobile />
        <div className="vidHeroHeader">
          <div className="vidHeroBackground">

            <video autoPlay="autoPlay">
              <source src="/img/bom/videos/selections.mp4"  type="video/mp4" />
              <source src="/img/bom/videos/selections.webm" type="video/webm" />
              <source src="/img/bom/videos/selections.webm" type="video/ogg" />
            </video>
          </div>
          <div className="vidHeroContentWrapper">
            <div className="vidHeroContent">
              <div className="innerWrapper">
              
                <h1 className="narrowContent"><q>“A Book Is A Dream You Hold In Your Hand”</q></h1>
                <div className="narrowContent"> 
                  <h4>
                    Neil Gaiman got it right. We are always on the lookout for the next great read – well-written, immersive stories that transport you, give you thrills, and tug at your heartstrings. Books that are truly worth reading.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="selectedBy">
          <div className="innerWrapper center">
            <h1>E Pluribus Five</h1>
            <h4>
              Our Editorial Team and Judges pore through hundreds of titles each month. We exchange, <em>ahem</em>, spirited opinions. And in the end (usually just before deadline!), we select the five best we can find and share them with our members.
            </h4>
            <img src="/img/bom/ill_selectedBySM.svg" className="forMobile"/>
          </div>
        </section>

        <section className="reviews noPadding secondaryBg">
          <div className="checkerboard">
            <div className="square content">
              <div className="inner">
                <h1>Reviews You Can Use, <span className="nowrap">To Choose</span></h1>
                <h4>
                  Ultimately, our members choose which books they would like to receive. So we work just as hard on explaining our selections as we do on picking them in the first place.
                </h4>
              </div>
            </div>
            <div className="square image">
              <div className="imageWrapper" />
            </div>
          </div>
        </section>

        <section className="selectionsListWrapper">
          <div className="innerWrapper center">
            <h1>Selections</h1>
            <h4>Click a book to read what the judge has to say</h4>
            <form className="sort">
              <fieldset className="center">
                <label>Select a month</label>
                <div className="selectWrapper">
                  <select name="month" onChange={this.handleSelectChange.bind( this )}>
                    <option value="0">{this.selectMatch[0].month}</option>
                    <option value="1">{this.selectMatch[1].month}</option>
                    <option value="2">{this.selectMatch[2].month}</option>
                    <option value="3">{this.selectMatch[3].month}</option>
                    <option value="4">{this.selectMatch[4].month}</option>
                  </select>
                </div>
              </fieldset>
            </form>
            <SelectionsListNM toggleModal={this.toggleModal} setActiveSelection={this.setActiveSelection} featuredObj={this.selectMatch[this.state.currentFeatured]} />
          </div>
        </section>
        <JoinBlock />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    features : state.features,
    products : state.products,
    storeTime : state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PageAboutSelections);
