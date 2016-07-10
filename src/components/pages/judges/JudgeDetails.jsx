import React, { Component }           from 'react';
import { connect }                    from 'react-redux';
import { push }                       from 'react-router-redux'
import { showBook }                   from '../../../modules/active_book';
import { bindActionCreators }         from 'redux';
import PointerLeft                    from '../../elements/PointerLeft.jsx';
import PointerRight                   from '../../elements/PointerRight.jsx';
import SocialIconTwitter              from '../../elements/SocialIconTwitter.jsx';
import SocialIconFacebook             from '../../elements/SocialIconFacebook.jsx';
import SocialIconInstagram            from '../../elements/SocialIconInstagram.jsx';
import dateformat from "dateformat";

class JudgeDetails extends Component{

  constructor(props){
    super(props);
    this.state = {
      pointerPrevActive : true,
      pointerNextActive : true,
      activeJudges : this.props.judges.filter( judge => this.props.inactiveJudges.indexOf(judge.id) === -1)
    }
    this.pointerFunction = this.pointerFunction.bind(this);
  }

  componentWillMount(){
    this.pointerFunction(this.props.activeJudge);
  }

  componentWillReceiveProps(nextProps){
    if(!this.props.activeJudge && nextProps.activeJudge) this.pointerFunction(nextProps.activeJudge);
  }

  pointerFunction(judge){
    if( judge ){
      let itemId              = judge.id,
          currentItemIndex    = 0,
          length              = 0;
      if(judge.guest){
        currentItemIndex  = this.props.guestJudges.findIndex( x =>  x.id == itemId);
        length            = this.props.guestJudges.length;
        if(currentItemIndex === 0)this.setState({ pointerPrevActive : false});
        else this.setState({ pointerPrevActive : true});
        this.setState({ pointerNextActive: true });
      } else {
        currentItemIndex  = this.state.activeJudges.findIndex( x =>  x.id == itemId);
        length            = this.state.activeJudges.length;
        if(currentItemIndex === length - 1 ) this.setState({ pointerNextActive: false });
        else this.setState({ pointerNextActive: true });
        this.setState({ pointerPrevActive: true });
      }
    }
  }

  renderPicksList(){
    return this.props.judgeProducts.map((book)=>{
      return(
          <li className="sliderItem" key={book.img}
            onClick={() => this.props.showBook(book)}
          >
            <img src={"//s3.amazonaws.com/botm-media/covers/120x180/" + book.img } />
            <h5 className="center">{dateformat( new Date((book.month + 1) + "/1/" + ( book.year + 2015)), "mmm yyyy")}</h5>
          </li>
        );
    });
  }

//How can this be done better!!!!
  changeSelection(direction){
    let newJudge            = {},
        itemId              = this.props.activeJudge.id,
        currentItemIndex    = 0,
        length              = 0,
        nextPos             = 0;

    if( this.props.activeJudge.guest ){
      currentItemIndex  = this.props.guestJudges.findIndex( x =>  x.id == itemId);
      length            = this.props.guestJudges.length;
      nextPos           = currentItemIndex + (direction === "next" ? 1 : -1 );

      if(nextPos === 0) this.setState({ pointerPrevActive : false});
      else this.setState({ pointerPrevActive : true});
      this.setState({pointerNextActive : true});
      if (direction === 'prev' && currentItemIndex >= 1){
        newJudge = this.props.guestJudges[(parseFloat(currentItemIndex) - 1)];
      }else if (direction === 'next' && currentItemIndex < (length -1)){
        newJudge = this.props.guestJudges[(parseFloat(currentItemIndex) + 1)];
      } else if(direction === 'next' && currentItemIndex === (length -1)){
        newJudge = this.props.judges[0];
      } else{
        newJudge = this.props.activeJudge;
      }
    } else {
      currentItemIndex  = this.state.activeJudges.findIndex( x =>  x.id == itemId);
      length            = this.state.activeJudges.length;
      nextPos           = currentItemIndex + (direction === "next" ? 1 : -1 );


      if(nextPos === length - 1 ) this.setState({ pointerNextActive: false });
      else this.setState({pointerNextActive : true});
      this.setState({ pointerPrevActive: true });
      if ((direction === 'prev') && (currentItemIndex >= 1)){
        newJudge = this.state.activeJudges[(parseFloat(currentItemIndex) - 1)];
        

      } else if ((direction === 'next') && (currentItemIndex < (length -1))){
        newJudge = this.state.activeJudges[(parseFloat(currentItemIndex) + 1)];
      } else if ( direction === 'prev' && currentItemIndex === 0 ){
        newJudge = this.props.guestJudges[ this.props.guestJudges.length - 1 ];
      } else {
        newJudge = this.props.activeJudge;
      }
    }
    this.props.push('/judges/'+ encodeURIComponent(newJudge.name.replace(/\s+/g, '-').toUpperCase()) + '-' + newJudge.id );
  }

  render(){
    if (!this.props.activeJudge) return <div />;
    let socialMediaFacebook   = '';
    let socialMediaTwitter    = '';
    let socialMediaInstagram  = '';
    let firstName = this.props.activeJudge.name.substr(0, this.props.activeJudge.name.indexOf(" ")).toUpperCase() || "";
    if (this.props.activeJudge.social.facebook  != null) socialMediaFacebook  =( <SocialIconFacebook linkPath = {this.props.activeJudge.social.facebook}/> );
    if (this.props.activeJudge.social.twitter   != null) socialMediaTwitter =( <SocialIconTwitter linkPath = {this.props.activeJudge.social.twitter}/> );
    if (this.props.activeJudge.social.instagram != null) socialMediaInstagram =( <SocialIconInstagram linkPath = {this.props.activeJudge.social.instagram}/> );

console.log(this.props.judges);

    return(
      <div className={"modalWrapper forJudgeDetails" + ((this.props.activeJudge) ? " showing" : " ")}>
        <div className={"judgeDetails pageModal" + ((this.props.activeJudge) ? " showing" : " ")}>
          <div className="modalClose" onClick={() => this.props.push('/judges')}>
            <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
              <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
            </svg>
          </div>
          <div className="flag">
            <h6 className="knockout">Judge</h6>
          </div>
          <section className="judgeHeader">
            <PointerLeft pointerPrevActive = {this.state.pointerPrevActive}  handleClick={this.changeSelection.bind(this, 'prev')} />
            <div>
                <img src={"//s3.amazonaws.com/botm-media/judges/" + this.props.activeJudge.img} className="judgeImg" />
                <h2 className="judgeName">{this.props.activeJudge.name}</h2>
                <h6 className="judgeRole" dangerouslySetInnerHTML={{__html: this.props.activeJudge.role}} />
                <div className="socialMedia">
                  {socialMediaFacebook}
                  {socialMediaTwitter}
                  {socialMediaInstagram}
                </div>
            </div>
            <PointerRight pointerNextActive = {this.state.pointerNextActive} handleClick={this.changeSelection.bind(this, 'next')}/>
          </section>
          <section className="secondaryBg">
            <div className="content">
              <div dangerouslySetInnerHTML={{__html: this.props.activeJudge.bio}} />
              <div className="sliderWrapper">
                <h3 className="center">{firstName + "'S"} SELECTIONS</h3>
                <ul className="sliderItemsContainer">
                  {this.renderPicksList()}
                 </ul>
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
    activeJudge  : state.activeJudge,
    judgeProducts: state.activeJudge ? Object.values(state.products).filter(x => x.judge_id === state.activeJudge.id) : {},
    guestJudges : state.guestJudges,
    judges : Object.values(state.judges).filter( x => !x.guest ),
    inactiveJudges : state.inactiveJudges
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ push, showBook }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JudgeDetails);