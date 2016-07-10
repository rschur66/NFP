import React, {Component}     from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import PointerLeft            from './PointerLeft.jsx';
import PointerRight           from './PointerRight.jsx';

export default class ProductImgCarousel extends Component {

  constructor(props){
    super(props);
    this.state = {
      pointerNextActive  : false,
      pointerPrevActive  : false,
      carouselImages : this.props.carouselImages,
      activeImage : 0
    }
    this.changeImage = this.changeImage.bind(this);
  }

  changeImage(direction){
    let activeImage = this.state.activeImage,
        totalImages = this.props.carouselImages.length;

    if ((direction === 'prev') && (activeImage > 0)) {
      activeImage--;
      this.setState({ activeImage : activeImage});
    }else if ((direction === 'next') && (activeImage < (totalImages-1))){
      activeImage++;
      this.setState({ activeImage : activeImage});
    }
    if (activeImage === 0){
      this.setState({ pointerPrevActive : false});
    } else { this.setState({ pointerPrevActive : true }); }

    if (activeImage >= (totalImages-1)){
      this.setState({ pointerNextActive : false });
    }else{ this.setState({ pointerNextActive : true }); }

  }


  renderImages(){
    return this.props.carouselImages.map ( (oItem, i) => {
      return(
        <li className={"image"+i+(this.state.activeImage === i ? ' active' : '')} key={i}>
          <img src={ oItem } />
        </li>
      );
     });
  }

  render() {

    return(
      <div className="productCarousel">
        <div className="pointerWrapper">
          <PointerLeft 
            handleClick={this.changeImage.bind(this, 'prev')}  
            pointerPrevActive={this.state.pointerPrevActive} 
          />
        </div>
        <ul className="carouselSlides">
          {this.renderImages()}
        </ul>
        <div className="pointerWrapper">
          <PointerRight 
            handleClick={this.changeImage.bind(this, 'next')}
            pointerNextActive={this.state.pointerNextActive} 
          />
        </div>
      </div>
    );
  }
};
