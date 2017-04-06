/**
 * Simple D3 visualization of income inequality.
 *
 * Source: http://www.oecd.org/social/OECD2016-Inequality-Update-Figures.xlsx
 * More Info: http://www.oecd.org/social/income-distribution-database.htm
 */

import React from 'react';
import { render } from 'react-dom';
import { extend } from 'lodash';

import dataArray from './data/countries.csv';
import * as utils from './utils';
import * as chartCreator from './chart-creator';

class App extends React.Component {
  constructor(props) {
    super(props);
    const countryData = dataArray.map((row) => {
      let countryObj = {};
      countryObj.name = row[0];
      countryObj.gini = parseFloat(row[3]);
      countryObj = extend(countryObj, utils.countryToGraphData(row));
      return countryObj;
    });
    this.state = {
      countryData,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    chartCreator.renderChart(this.state.countryData);
  }
  updateSort(sortMethod) {
    const newCountryData = this.state.countryData.sort(sortMethod);
    this.setState({
      countryData: newCountryData,
    });
    chartCreator.renderChart(this.state.countryData);
  }
  render() {
    return (
      <div>
        <div className="main-container">
          <h1>Income Inequality in OECD Countries</h1>
          <button onClick={() => this.updateSort(utils.sortingMethods.alpha)}>Sort Alphabetically</button>
          <button onClick={() => this.updateSort(utils.sortingMethods.gini)}>Sort by Gini Coefficient</button>
          <br />
          <svg id="stack-chart" width="1000" height="600" />
        </div>
      </div>
    );
  }
}

render(
  <App />,
  document.querySelector('#app'), // eslint-disable-line no-undef
);

