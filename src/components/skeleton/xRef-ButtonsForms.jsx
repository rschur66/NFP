import React from 'react';
import CheckMark from '../elements/CheckMark.jsx';

const ButtonsForms = () =>{

let divStyle = { margin: '10px 0',};
let divStyle2 = { 
  margin: '40px 0',};
let hrStyle = {
  margin: '60px 0 20px 0',
  width: '90%'
};


  return(
    <div className="bodyContentCMS">
      <h1 className="sectionHeader">Buttons</h1>
      <div className="col -w50">
        <div style={divStyle}> 
          <button className="primary">primary</button>
        </div>
        <div style={divStyle}> 
          <button className="primary fat">primary fat</button>
        </div>
        <div style={divStyle}> 
          <button className="primary alt">primary + alt</button>
        </div>
        <div style={divStyle}> 
          <button className="primary narrow">primary +.narrow</button>
        </div>
        <div style={divStyle}> 
          <button className="secondary">secondary</button>
        </div>
        <div style={divStyle}> 
          <button className="secondary alt">secondary + alt</button>
        </div>
        <div style={divStyle}> 
          <button className="tertiary">tertiary</button>
        </div>
        <div style={divStyle}> 
          <button className="tertiary alt">tertiary alt</button>
        </div>
        <div style={divStyle}> 
          <button className="inline">inline</button>
        </div>
        <div style={divStyle}> 
          <button className="disabled">disabled</button>
        </div>

      </div>

      <div className="col -w50">
        <h6>button wrappers</h6>
        <span>div.confirmationActions</span>
        <div className="confirmationActions">
          <button className="primary">primary</button>
          <button className="secondary">secondary</button>
        </div>
        <span>div.actionGroup</span>
        <div className="actionGroup">
          <button className="primary">primary</button>
          <button className="secondary">secondary</button>
        </div>
      </div>


      <div style={divStyle2}>
        <h1 className="sectionHeader">Forms</h1>
        <form>
          <h4 className="alt">Form section header (h4.alt)</h4>
          <fieldset>

            <input type="text" placeholder="input type text"/>
            <input type="password" className="inputError" placeholder=".inputError"/>

            <input type="text" className="half left" placeholder="half.left"/>
            <input type="text" className="half right" placeholder="half.right"/>

            <input type="text" className="third" placeholder="third"/>
            <input type="text" className="third middle" placeholder="third.middle"/>
            <input type="text" className="third" placeholder="third"/>

            <textarea placeholder="textarea"/>

            <div className="selectWrapper">
              <select defaultValue = ''>
                <option value="jan">div.selectWrapper</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
              </select>
            </div>

          <div className="checkWrapper">
            <label>
              <input type="radio" name="plan" />
              <div>
                <CheckMark />
                <span>Custom radio button</span>
              </div>
            </label>
            <label>
              <input type="radio" name="plan" />
              <div>
                <CheckMark />
                <span>Custom radio button</span>
              </div>
            </label>
            <label>
              <input type="radio" name="plan" />
              <div>
                <CheckMark />
                <span>Custom radio button</span>
              </div>
            </label>
          </div>


          </fieldset>
        </form>

        <h6 className="customBigSelects">customBigSelects</h6>
        <ul className="customBigSelects">
          <li>
            <label>
              <input type="checkbox" name="genre" value="thiller"  /> 
              <div>
                <CheckMark />
                <div className="topContent" />
                <div className="bottomContent">
                <h6>MYSTERY</h6>
                </div>
              </div>
            </label>
          </li>

          <li>
            <label>
              <input type="checkbox" name="genre" value="Killer"  /> 
              <div>
                <CheckMark />
                <div className="topContent" />
                <div className="bottomContent">
                <h6>Killer</h6>
                </div>
              </div>
            </label>
          </li>

          <li>
            <label>
              <input type="checkbox" name="genre" value="What" /> 
              <div>
                <CheckMark />
                <div className="topContent" />
                <div className="bottomContent">
                <h6>What</h6>
                </div>
              </div>
            </label>
          </li>

        </ul>

        <h6>Single input form</h6>
        <form className="singleInput">
          <div className="fieldsWrapper">
            <input
                type        = "email"
                required    = "required"
                placeholder = "Email"
            />
            <button className="primary">SIGN UP</button>
          </div>
        </form>

      </div>


      <div style={divStyle2} >
        <h1 className="sectionHeader">Links</h1>
        <a className="bigLink">a.bigLink</a>
        <br />
        <a className="h6">a.h6</a>
        <br />
        <a className="link">a.link</a>

        <ul className="linkBoxes">
          <li>
            <a href="#">
              <div className="topContent">
                <img src="" />
              </div>
              <div className="bottomContent">
                <h6>linkBoxes</h6>
              </div>
            </a>
          </li>
        </ul>

      </div>


    </div>
  );
}

export default ButtonsForms;