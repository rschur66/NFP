import React, { Component } from 'react';
import { connect }          from 'react-redux';
import PointerLeft          from '../../elements/PointerLeft.jsx'
import PointerRight         from '../../elements/PointerRight.jsx'

class Timeline extends Component {

  constructor() {
    super();
    this.state = {
      activeHero : 1,
      carouselInterval: null,
      pointerPrevActive : true,
      pointerNextActive : true
    };
    this.slidesNum = 6;
    this.updateActiveHero = this.updateActiveHero.bind(this);
    this.stepThroughHeros = this.stepThroughHeros.bind(this);
  }

    updateActiveHero(hero) {
      this.setState({ activeHero: hero });
    }

    stepThroughHeros(direction) {
      let activeHero = this.state.activeHero;
      let slidesNum = this.slidesNum;
      if (direction === 'back') {
        if (activeHero > 1){
          activeHero -= 1;
        } else {
          activeHero = slidesNum;
        }
      } else {
        if (activeHero < slidesNum){
          activeHero += 1;
        } else {
          activeHero = 1;
        }
      }
      this.updateActiveHero(activeHero);
    }

    componentDidMount(){
      this.carouselInterval = setInterval(()=> {
        this.stepThroughHeros('forward');
      }, 8000);
    }

    componentWillUnmount() {
      clearInterval(this.carouselInterval);
    }

    renderSlides(){
      return this.props.timeline.map((slide, i)=>{
        let backgroundImg={  backgroundImage: 'url(/img/bom/our_story/' + slide.image + ')' }
        return(
          <li key={slide.year} className={(this.state.activeHero == slide.id ? 'active' : '')}>
            <div className="checkerboard">
              <div className="square image" style={backgroundImg} />
              <div className="square content highlightBg">
                <div className="innerContent">
                  <h6 className="alt">{slide.year}</h6>
                  <h1 className="knockout">{slide.headline}</h1>
                  <h5 className="knockout">{slide.body}</h5>
                </div>
              </div>
            </div>
          </li>
        );
      });
    }

    renderSubwayMap(){
      return this.props.timeline.map((bullet, i)=>{
        return(
          <li
            key={ bullet.id }
            className={(this.state.activeHero === bullet.id ? 'active' : '')}
            onClick={this.updateActiveHero.bind(this, bullet.id)}
          >
            <span className="textLinks">{bullet.year}</span>
            <div className={(bullet.id===1 ? 'noLine' : '')} />
            <div>
              <div className="circle" />
            </div>
            <div className={(bullet.id===6 ? 'noLine' : '')} />
          </li>
        );
      });
    }

  render() {
    let activeHero = this.state.activeHero;
    return(
      <section className="timeLine noPadding">
        <ul className="carouselSlides">
          {this.renderSlides()}
        </ul>
        <div className="subwayMapWrapper">
          <ul className="subwayMapLinks">
            {this.renderSubwayMap()}
          </ul>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state){
  return{ timeline : state.timeline };
}

export default connect(mapStateToProps)(Timeline);
