import React, {Component} from 'react';
import {connect} from 'react-redux';

class WeatherList extends Component {

  renderWeather(cityData){
    return(
        <tr key={cityData.city.name}>
          <td>{cityData.city.name}</td>
        </tr>
      );
  }

  render(){
    return (
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Tempeture</th>
              <th>Pressure</th>
              <th>Humidity</th>
            </tr>
          </thead>

          <tbody>
            {this.props.weather.map(this.renderWeather)}
          </tbody>

        </table>
      );
  }

}

function mapStateToProps({weather}){ //es6 syntax instead of (state)
  return { weather}; // es6 syntax instead of weather: weather 
}

// connect function 'WeatherList' to component "WeatherList"
export default connect(mapStateToProps)(WeatherList);