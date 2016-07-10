 import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import { bindActionCreators } from 'redux';
import { showBook } from '../../../modules/active_book';
import { push } from 'react-router-redux';
import { Link }               from 'react-router';
import dateformat             from "dateformat";
import PointerLeft            from '../../elements/PointerLeft.jsx';
import PointerRight           from '../../elements/PointerRight.jsx';
import AddActions             from './AddActions.jsx';

class DetailsMobile extends Component{

  constructor(props){
    super(props);
    this.state ={
      showContent : false,
      activeModal : ''
    }
  }

  toggleContent(){
    this.setState ({ showContent : !this.state.showContent });
  }

  toggleModal(sType) {
    let sCurrentType = this.state.activeModal;
    if (sCurrentType.toString() === sType.toString()) sType = '';
    this.setState({
      activeModal: sType
    });
  }


  clearModal(){
    if( typeof document !== 'undefined' ) document.getElementById("body").className = "modalClosed";
  }

  changeSelection(book){
    let currentUrl = window.location.pathname;
    this.props.push(currentUrl.slice(0, currentUrl.lastIndexOf('/')) + '/' + book.title.toLowerCase().split(' ').join('-') + '-' + book.id );
    this.props.showBook(book);
    if( typeof document !== 'undefined' ) document.getElementById("modalWrapper").scrollTop=0;
  }

  renderNav(){
    let storeTime           = new Date(this.props.storeTime),
        rawYear             = this.props.activeBook.year,
        featuredSelections  = this.props.features[rawYear][parseInt(this.props.activeBook.month)].featured.map( x => this.props.products[x]);

    return featuredSelections.map((book)=>{
      let isActive = ((this.props.activeBook.id === book.id) ? ' active' : '');
      return(
        <li key={book.id} onClick={() => this.changeSelection(book)}>
          <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + book.img} className={"cover" + isActive}/>
        </li>
      );
    });
  }

  render(){
    if (!this.props.activeBook) return <div />;
    let storeTime = new Date( this.props.storeTime );
    let oAuthors = this.props.activeBookAuthors.map( x => x.name ).join(', ');
    let actions = (<div className="addActions"><Link className="button primary" to="enroll" onClick={this.clearModal.bind(this)}>Join Now</Link></div>)
    if (this.props.isLoggedIn) actions = (<AddActions activeBook={this.props.activeBook} />);

    return(
      <div className={"modalWrapper -forMobileDetails" + ((this.props.activeBook) ? " showing" : " ")} id="modalWrapper">
        <div className="bottomNav" id="bottomNav">
          <h6 className="alt">{dateformat( new Date( new Date().setMonth(parseInt(this.props.activeBook.month))) , "mmmm" )} selections</h6>
          <ul>
            {this.renderNav()}
          </ul>
        </div>
        <div className="selectionDetails pageModal" id="pageModal">
          <div className="topWrapper">
            <h1 className="title">{this.props.activeBook.title}</h1>
            <h6 className="alt">By {oAuthors}</h6>
            {actions}
            <img src={"//s3.amazonaws.com/botm-media/covers/200x300/" + this.props.activeBook.img} className="cover"/>
          </div>
          <section className="judgeNameWrapper">
            <img src={"//s3.amazonaws.com/botm-media/judges/" + this.props.activeBookJudge.img} className="judgeImg" />
            <h6>Judge</h6>
            <h6 className="alt">{this.props.activeBookJudge.name}</h6>
          </section>
          <section className="content secondaryBg">
            <h2 className="reviewTitle">{this.props.activeBook.description_title}</h2>
            <h6 className="alt byLine">By {this.props.activeBookJudge.name}</h6>
            <div dangerouslySetInnerHTML={{__html: this.props.activeBook.description}} />
          </section>
          
          <section className="authorWrapper">
            <div className="expander" onClick={this.toggleContent.bind(this)}>
              <svg version="1.1" x="0px" y="0px" width="19.949px" height="19.842px" viewBox="0 0 19.949 19.842" enableBackground="new 0 0 19.949 19.842">
                <polygon fill="#231F20" points="19.696,9.584 10.233,9.585 10.232,0.123 9.593,0.122 9.593,9.585 0.13,9.585 0.13,10.225 
                    9.593,10.225 9.593,19.688 10.233,19.688 10.233,10.225 19.696,10.225 "/>
              </svg>
            </div>
            <img src={"//s3.amazonaws.com/botm-media/authors/" + this.props.activeBookAuthors[0].img } className="authorImg"/>
            <h6 className="author">{this.props.activeBookAuthors[0].name}</h6>
            <div className={"toggledContent" + ((this.state.showContent) ? ' show' : ' hide')}>
              <div dangerouslySetInnerHTML={{__html: this.props.activeBookAuthors[0].bio}} />
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
  return bindActionCreators({ push, showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsMobile);