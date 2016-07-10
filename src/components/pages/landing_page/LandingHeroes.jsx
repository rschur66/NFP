import React, {Component}   from "react";
import {Link}               from "react-router";
import {connect}            from "react-redux";
import {showBook}           from "../../../modules/active_book";
import {bindActionCreators} from "redux";

class LandingHeroes extends Component {
  forceUpdate(callBack) {
    return super.forceUpdate(callBack);
  }

  constructor(props) {
    super(props);
    this.state = {
      // activeHero : 2,
      activeHero : parseInt(this.props.activeHero || 1),
      carouselInterval: null,
      pointerPrevActive : true,
      pointerNextActive : true
    };
    this.slidesNum = 3;
    this.updateActiveHero = this.updateActiveHero.bind(this);
    this.stepThroughHeros = this.stepThroughHeros.bind(this);
  }

  updateActiveHero(hero) { 
    clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(()=> {
      this.stepThroughHeros('forward');
    }, 9000);
    this.setState({ activeHero: hero}); 

  }

  stepThroughHeros(direction) {
    let activeHero = this.state.activeHero,
        slidesNum = this.slidesNum;
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

  componentDidMount() {
    this.carouselInterval = setInterval(()=> {
      this.stepThroughHeros('forward');
    }, 9000);
  }

    componentWillUnmount() {
      clearInterval(this.carouselInterval);
    }

    render() {
      let activeHero = this.state.activeHero/*,
          book = this.props.products[123]*/;

      return(
        <section className="LandingHeroes noPadding carouselSlidesWrapper">
          <ul className="carouselSlides">
            <li className={"slide" + (activeHero === 1 ? ' active' : '')}>
              <div className="innerWrapper">
                <div className="block -w40">
                  <h1>JULY 2016 SELECTIONS</h1>
                  <h4>
                    Use code SUMMER30 to get your free tote, sunnies, and 30% off 3 months of great books.
                  </h4>
                  <div className="buttonWrapper">
                   <Link className="button secondary" to="/enroll">GET STARTED</Link>
                  </div>
                </div>
                <div className="block -w60 imgWrapper" />
              </div>
            </li>

            <li className={"slide" + (activeHero === 2 ? ' active' : '')}>
              <div className="innerWrapper">
                <div className="block -w40">
                  <h1>July Guest Judge Arianna Huffington</h1>
                  <h4>
                    The media pioneer on her selection, <em>Love That Boy</em>
                  </h4>
                  <div className="buttonWrapper">
                   <Link className="button secondary" to="/love-that-boy-127">READ MORE</Link>
                  </div>
                </div>
                <div className="block -w60 imgWrapper" />
              </div>
            </li>

            <li className={"slide" + (activeHero === 3 ? ' active' : '')}>
              <div className="innerWrapper">
                <div className="block -w40">
                  <h1>Discover a better way to read</h1>
                  <h4>
                    Your next favorite book is on it's way, every month.
                  </h4>
                  <div className="buttonWrapper">
                   <Link className="button secondary" to="/enroll">GET STARTED</Link>
                  </div>
                </div>
                <div className="block -w60 imgWrapper" />
              </div>
            </li>

          </ul>
          <div className="carouselBullets">
            <ul>
              <li
                className={(activeHero === 1 ? 'active' : '')}
                onClick={this.updateActiveHero.bind(this, 1)}
              />
              <li
                className={(activeHero === 2 ? 'active' : '')}
                onClick={ this.updateActiveHero.bind(this, 2) }
              />
              <li
                className={(activeHero === 3 ? 'active' : '')}
                onClick={ this.updateActiveHero.bind(this, 3) }
              />
            </ul>
          </div>
        </section>
      );
    }
}

function mapStateToProps(state){
  return {
    products: state.products
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ showBook: showBook  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(LandingHeroes);