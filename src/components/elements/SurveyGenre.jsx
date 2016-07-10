import React, { Component }   from 'react';
import { Link }               from 'react-router';
import {connect}              from 'react-redux';
import { bindActionCreators } from 'redux';
import { addEnrollGenre, removeEnrollGenre } from '../../modules/enrollData';
import CheckMark              from './CheckMark.jsx';


export default class SurveyGenre extends Component{
  handleChange(genre, evt){
    if(evt.target.checked) this.props.addEnrollGenre(genre);
    else this.props.removeEnrollGenre(genre);
  }

  render(){
    const existingGenres = ["thriller", "fantasy", "historical fiction", "literary fiction", "history", "womens fiction", "memoir", "adventure", "true crime"];
    let selectedGenres = {};
    
    //existingGenres.forEach( x => selectedGenres[x] = this.props.genres.find( g => g === x ) ? "checked" : "" ); *** breaks ie11

    return(
        <div className="surveyGenre">
          <h1>Which type of books would you like to read more of?</h1>
          <h4>Select all that apply</h4>

            <ul className="customBigSelects">
              <li>
                <label>
                  <input type="checkbox" name="genre" value="thiller" onChange={this.handleChange.bind( this, 'thriller' )} checked={selectedGenres['thriller']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-thrillers.svg" alt="Thrillers" />
                    </div>
                    <div className="bottomContent">
                      <h6>MYSTERY/ THRILLER</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="fantasy" onChange={this.handleChange.bind( this, 'fantasy' )} checked={selectedGenres['fantasy']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-scifi.svg" alt="Sci-Fi" />
                    </div>
                    <div className="bottomContent">
                      <h6>SCI FI & FANTASY</h6>
                    </div>
                  </div>
                </label> 
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="historical fiction" onChange={this.handleChange.bind( this, 'historical fiction' )} checked={selectedGenres['historical fiction']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-histFiction.svg" alt="Historial Fiction" />
                    </div>
                    <div className="bottomContent">
                      <h6>HISTORICAL FICTION</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="literary fiction" onChange={this.handleChange.bind( this, 'literary fiction' )} checked={selectedGenres['literary fiction']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-litFiction.svg" alt="Literary Fiction" />
                    </div>
                    <div className="bottomContent">
                      <h6>LITERARY FICTION</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="womens fiction" onChange={this.handleChange.bind( this, 'womens fiction' )} checked={selectedGenres['womens fiction']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-womansFiction.svg" alt="Woman's Fiction" />
                    </div>
                    <div className="bottomContent">
                      <h6>WOMEN’S FICTION</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="history" onChange={this.handleChange.bind( this, 'history' )} checked={selectedGenres['history']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-history.svg" alt="History" />
                    </div>
                    <div className="bottomContent">
                      <h6>HISTORY</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="memoir" onChange={this.handleChange.bind( this, 'memoir' )} checked={selectedGenres['memoir']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-memoir.svg" alt="Memoir" />
                    </div>
                    <div className="bottomContent">
                      <h6>MEMOIR</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="adventure" onChange={this.handleChange.bind( this, 'adventure' )} checked={selectedGenres['adventure']} />
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-travel.svg" alt="Travel" />
                    </div>
                    <div className="bottomContent">
                      <h6>TRAVEL & ADVENTURE</h6>
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="genre" value="true crime" onChange={this.handleChange.bind( this, 'true crime' )} checked={selectedGenres['true crime']}/>
                  <div>
                    <CheckMark />
                    <div className="topContent">
                      <img src="/img/bom/genre/ill-trueCrime.svg" alt="True Crime" />
                    </div>
                    <div className="bottomContent">
                      <h6>TRUE CRIME</h6>
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          <button className="primary fat" onClick={() => this.props.nextStep()}>Continue</button>
          
        </div>
    );
  }
}

function mapStateToProps(state){
  return { 'genres': state.enrollData.genres }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ addEnrollGenre, removeEnrollGenre }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyGenre);