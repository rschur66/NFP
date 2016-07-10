/* *******************************
Book Details view
********************************** */

import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { showBook, hideBook } from '../../../modules/active_book';
import { push } from 'react-router-redux';
import { Link }               from 'react-router';
import dateformat             from "dateformat";
import PointerLeft            from '../../elements/PointerLeft.jsx';
import PointerRight           from '../../elements/PointerRight.jsx';
import AddActions             from './AddActions.jsx';

class BookDetails extends Component{

  constructor(props){
    super(props);
    this.state ={
      showContent       : false,
      pointerPrevActive : true,
      pointerNextActive : true
    };
    this.changeSelection = this.changeSelection.bind(this);
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  clearModal(){
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
  }

  changeSelection(direction){
    let newBook           = {},
        itemId            = this.props.activeBook.id,
        rawYear           = this.props.activeBook.year,
        featured          = this.props.features[rawYear][parseInt(this.props.activeBook.month)].featured,
        currentItemIndex  = featured.indexOf(itemId),
        newIndex          = 0;
        length            = featured.length;

    if ((direction === 'prev') && (currentItemIndex >= 1)){
      newIndex = (parseFloat(currentItemIndex) - 1);
      newBook = this.props.products[featured[newIndex]];

    }else if ((direction === 'next') && (currentItemIndex < (length -1))){
      newIndex = (parseFloat(currentItemIndex) + 1);
      newBook = this.props.products[featured[newIndex]];
    }else{
      newIndex = parseFloat(currentItemIndex);
      newBook = this.props.activeBook;
    }
    let currentUrl = window.location.pathname;
    this.props.push(currentUrl.slice(0, currentUrl.lastIndexOf('/')) + '/' + newBook.title.toLowerCase().split(' ').join('-') + '-' + newBook.id );
    this.props.showBook(newBook);
    if (newIndex >= (length-1)){ this.setState({ pointerNextActive : false }) }
    else { this.setState({ pointerNextActive : true }) }

    if (newIndex <= 0){ this.setState({ pointerPrevActive : false }) }
    else { this.setState({ pointerPrevActive : true }) }
  }

  render(){
    if (!this.props.activeBook) return <div />;
    let oAuthors = this.props.activeBookAuthors.map( x => x.name ).join(', '),
        actions = (<div className="addActions"><Link className="button primary" to="enroll" onClick={this.clearModal.bind(this)}>Join Now</Link></div>)
    if (this.props.isLoggedIn) actions = (<AddActions activeBook={this.props.activeBook} clearModal={this.clearModal}/>);

    return(
      <div className = {"modalWrapper -forDesktopDetails" + ((this.props.activeBook) ? " showing" : " ")}>
        <div className="selectionDetails pageModal">
          <div className="modalClose" onClick={() => this.props.hideBook()}>
            <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
              <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584
                6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
            </svg>
          </div>
          <div className="flag">
            <h6 className="knockout">{dateformat( new Date( new Date().setMonth(parseInt(this.props.activeBook.month))) , "mmmm" )}</h6>
          </div>
          <PointerLeft pointerPrevActive = {this.state.pointerPrevActive} handleClick = {this.changeSelection.bind(this, 'prev')} />
          <div className="selectionHeader">
            <h1 className="title">{this.props.activeBook.title}</h1>
            <h6 className="alt">By {oAuthors}</h6>
            {actions}
             <div>
                <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + this.props.activeBook.img} className="cover col -w30" />
                <div className="col -w70 quoteWrapper">
                  <h4 className="quote" dangerouslySetInnerHTML={{__html: this.props.activeBook.judge_blurb}} />
                  <div onClick={() => this.props.push('/judges/' + encodeURIComponent(this.props.activeBookJudge.name.replace(/\s+/g, '-').toUpperCase()) + '-' + this.props.activeBookJudge.id)}>
                    <img src={"//s3.amazonaws.com/botm-media/judges/" + this.props.activeBookJudge.img} className="judgeImg" />
                    <div className="judgeNameWrapper">
                      <h6>Judge</h6>
                      <h6 className="alt">{this.props.activeBookJudge.name}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <PointerRight pointerNextActive = {this.state.pointerNextActive} handleClick = {this.changeSelection.bind(this, 'next')}/>
          <section className="review secondaryBg">
            <div className="content">
              <h2 className="reviewTitle">{this.props.activeBook.description_title}</h2>
              <h6 className="alt byLine">By Judge {this.props.activeBookJudge.name}</h6>
              <div dangerouslySetInnerHTML={{__html: this.props.activeBook.description}} />
              <h6>&mdash; {this.props.activeBookJudge.name}</h6>
            </div>
          </section>

          <section className="authorWrapper">
            <div className="content">
              <div className="expander" onClick={this.toggleContent.bind(this)}>
                <svg version="1.1" x="0px" y="0px" width="19.949px" height="19.842px" viewBox="0 0 19.949 19.842" enableBackground="new 0 0 19.949 19.842">
                  <polygon fill="#231F20" points="19.696,9.584 10.233,9.585 10.232,0.123 9.593,0.122 9.593,9.585 0.13,9.585 0.13,10.225
                    9.593,10.225 9.593,19.688 10.233,19.688 10.233,10.225 19.696,10.225 "/>
                </svg>
              </div>
              <img src={"//s3.amazonaws.com/botm-media/authors/" + this.props.activeBookAuthors[0].img } />
              <a className="authorName bigLink" onClick={this.toggleContent.bind(this)}>About {this.props.activeBookAuthors[0].name}</a>
              <div className={"toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
                <div dangerouslySetInnerHTML={{__html: this.props.activeBookAuthors[0].bio}} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    activeBook        : state.activeBook,
    activeBookAuthors : state.activeBook ? state.activeBook.authors.map( x => state.authors[x] ) : [],
    activeBookJudge   : state.activeBook ? state.judges[state.activeBook.judge_id] : {},
    features          : state.features,
    products          : state.products,
    isLoggedIn        : state.member ? true : false,
    storeTime         : state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ push, showBook, hideBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
