import React, { Component }   from 'react';
import { connect }            from 'react-redux'; 
import SocialIcons            from '../../elements/SocialIcons.jsx';
import PointerLeft            from '../../elements/PointerLeft.jsx';
import PointerRight           from '../../elements/PointerRight.jsx';

class LandingMembers extends Component {

  constructor(){
    super()
    this.state = {
      activeSocialMember :  false,
      pointerNextActive  :  true,
      pointerPrevActive  :  true
    }
    this.changeSelection = this.changeSelection.bind(this);
  }

  closeModal(){
   this.setState({ 
    activeSocialMember :  false,
    pointerNextActive  :  true,
    pointerPrevActive  :  true
  });
  }

  showSocialMember(member){
    if (member.id === 0) this.setState({ pointerPrevActive : false});
    if (member.id >= (this.props.members.length -1)) this.setState({ pointerNextActive : false});
    this.setState({  activeSocialMember :  member });
  }

  changeSelection(direction){
    let memberId  = this.state.activeSocialMember.id;
    if ((direction === 'prev') && (memberId > 0)){
      memberId--;
      this.setState({ activeSocialMember : this.props.members[memberId] });
    }else if ((direction === 'next') && (memberId < (this.props.members.length -1))){
      memberId++;
      this.setState({ activeSocialMember : this.props.members[memberId] });
    }
    if (memberId === 0){
      this.setState({ pointerPrevActive : false});
    } else { this.setState({ pointerPrevActive : true }); }

    if (memberId >= (this.props.members.length -1)){
      this.setState({ pointerNextActive : false });
    }else{ this.setState({ pointerNextActive : true }); }

  }

  renderList(){
    return this.props.members.map((member, i)=>{
      return(
        <li className="sliderItem" key={member.id} onClick={this.showSocialMember.bind(this, member )}>
          <img src={"/img/bom/members/"+ member.image}/>
          <h6>{member.name}</h6>
          <span className="smallText">{member.town}</span>
        </li>
      );
    });
  }

  render(){ 
    let memberDetails = (<div />);
    if (this.state.activeSocialMember){
      memberDetails =(
        <div className = "modalWrapper showing">
          <div className="memberSocialDetails modal">
            <PointerLeft 
              handleClick={this.changeSelection.bind(this, 'prev')}  
              pointerPrevActive={this.state.pointerPrevActive} 
            />
            <div className="modalClose" onClick={this.closeModal.bind(this)}>
              <svg width="14.782px" height="14.533px" viewBox="0 0 14.782 14.533" enableBackground="new 0 0 14.782 14.533" >
                <polygon fill="#FFFFFF" points="14.572,13.966 7.881,7.275 14.571,0.584 14.119,0.131 7.428,6.823 0.737,0.131 0.284,0.584 
                  6.976,7.275 0.284,13.966 0.737,14.419 7.428,7.728 14.119,14.419   "/>
              </svg>
            </div>
            <img src={"/img/bom/members/"+ this.state.activeSocialMember.image}/>
            <div className="bottom">
              <div className="memberName">
                <h4 className="alt">{this.state.activeSocialMember.name}</h4>
                <h5>{this.state.activeSocialMember.town}</h5>
              </div>
              <h5 dangerouslySetInnerHTML={{__html: this.state.activeSocialMember.quote}} />
            </div>
            <PointerRight 
              handleClick={this.changeSelection.bind(this, 'next')}
              pointerNextActive={this.state.pointerNextActive} 
            />
          </div>
        </div>
      );
    }

    return(
      <section className="landingMembers center">
        {memberDetails}
        <h1>Meet Our Members</h1>
        <SocialIcons />
        <div className="sliderWrapper"> 
          <ul className="sliderItemsContainer">
            {this.renderList()}
          </ul>
         </div> 
      </section>
    );
  }
}

function mapStateToProps(state){
  return{
    members : state.members
  };
}

export default connect(mapStateToProps)(LandingMembers);
