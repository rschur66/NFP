import React, { Component }   from 'react';
import { bindActionCreators } from 'redux';
import { getDiscussions }     from '../../../modules/discussions';
import dateformat             from "dateformat";
import {connect}              from 'react-redux';
import PastMonths             from './PastMonths.jsx';
import AllBooks               from './AllBooks.jsx';
import StartForm              from './StartForm.jsx';
import ReplyForm              from './ReplyForm.jsx';
import DiscussionItem         from './DiscussionItem.jsx';
import PointerUpDown          from '../../elements/PointerUpDown.jsx';


class Discussions extends Component{

  constructor(){
    super();
    this.state ={
      startDiscussionState : false,
      showAllReplies  : true,
      showMobileMenu  : false
    };
    this.toggleShowReplies = this.toggleShowReplies.bind(this);
    this.toggleDiscussionForm = this.toggleDiscussionForm.bind(this);
  }

  toggleDiscussionForm(){
    this.setState ({ startDiscussionState : !this.state.startDiscussionState });
  }

  toggleShowReplies(){
    this.setState ({ showAllReplies : ! this.state.showAllReplies })
  }

  toggleMobileMenu(){
    this.setState ({ showMobileMenu : ! this.state.showMobileMenu })
  }

  componentWillMount(){
    this.props.getDiscussions(this.props.params);
  }

  handleResize(e) {
    if (window.innerWidth > 800) {
      if (this.state.showMobileMenu === true) this.setState({ showMobileMenu: false });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillReceiveProps(nextProps){
    if( this.props.params != nextProps.params )
      this.props.getDiscussions(nextProps.params);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render(){

    let oDiscussions = this.props.discussions.map ( (oDiscuss, i) => {
      return( <DiscussionItem key={i}
        discussion={oDiscuss}
        showAllReplies={this.state.showAllReplies}
        params={this.props.params} />
      );
    });

    let { type, product_id, month, year } = this.props.params,
        storeTime = new Date(this.props.storeTime);
    let prevMonth = new Date( new Date().setMonth( storeTime.getMonth() -1 ) ),
        title = ( storeTime.getDate() >= this.props.mid_ship_date ? dateformat( storeTime, "mmmm" ) : dateformat( prevMonth, "mmmm" ) ) + " Books";

    if(type === 'product' && product_id )
      title = this.props.products[parseInt(product_id)].title;
    else if( type === 'month' && month && year )
      title = dateformat( new Date( new Date().setMonth(parseInt(month))) , "mmmm" ) + " Books";

    return(
      <div className="bodyContent discussions">
        <section className="innerWrapper">
          <h1>Discussions</h1>

          <div className={"col -w20 menuWrapper" + ((this.state.showMobileMenu) ? " show" : " hide")}>
            <PastMonths />
            <AllBooks />
          </div>

          <div className="col -w80 mainContentBox">

            <div className="borderedBox">
              <StartForm startDiscussionState = {this.state.startDiscussionState} toggleDiscussionForm = {this.toggleDiscussionForm}/>

              <div className="headerBox">
                <button
                  className="primary startNewDiscussion"
                  onClick ={this.toggleDiscussionForm.bind(this)}
                >Start A Discussion</button>
                <div
                  className={"mobileMenu"  + ((this.state.showMobileMenu) ? " expanded" : " collapsed")}
                  onClick ={this.toggleMobileMenu.bind(this)}
                >
                  <PointerUpDown />
                  <h6 className="alt col">{title}</h6>
                </div>
                <h6 className="alt col viewTitle">{title}</h6>
              </div>

              <div
                className={"tertiaryColor collapseActions" + ((this.state.showAllReplies) ? " expanded" : " collapsed")}
                onClick={this.toggleShowReplies.bind(this)}
              >
                all <PointerUpDown />
              </div>

              { oDiscussions }

            </div>
          </div>
        </section>
      </div>
    );
  }
}


function mapStatetoProps(state){
  return {
    'discussions': state.discussions,
    'products': state.products,
    'mid_ship_date': state.storeData.ship_days[1] + 2,
    'storeTime': state.storeTime
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ getDiscussions }, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(Discussions);
