import * as d3 from 'd3';
import { map } from 'lodash';

const Z_KEYS = ['Bottom 10%', '10-20%', '20-40%', '40-60%', '60-80%', '80-90%', 'Top 10%'];
const COLOR_ARRAY = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'];

/**
 * Take some income data by country and generate a D3 stacked
 * bar chart showing percentage share of each income bracket
 * @param {Array} countryData - Array of country income data
 */
export function renderChart(countryData) {
  const chart = d3.select('svg');
  chart.selectAll('*').remove();
  const margin = { top: 20, right: 100, bottom: 100, left: 40 };
  const width = +chart.attr('width') - margin.left - margin.right;
  const height = +chart.attr('height') - margin.top - margin.bottom;
  const g = chart.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  const y = d3.scaleLinear()
      .rangeRound([height, 0]);

  const z = d3.scaleOrdinal()
      .range(COLOR_ARRAY);

  x.domain(map(countryData, 'name'));
  y.domain([0, 100]);
  z.domain(Z_KEYS);

  // Create initial graph and set data
  g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(Z_KEYS)(countryData))
    .enter().append('g')
      .attr('fill', d => z(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter().append('rect')
      .attr('x', d => x(d.data.name))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());

  // Add x-axis
  g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-70)translate(-10, -10)');

  // Add y-axis
  g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(null, 's'))
    .append('text')
      .attr('x', 2)
      .attr('y', y(y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('font-weight', 'bold')
      .attr('font-size', '1.1em')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(-${margin.left - 5},${height / 2})rotate(-90)`)
      .text('Share of Total Income (%)');

  // Create legend
  const legend = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
    .selectAll('g')
    .data(Z_KEYS.slice().reverse())
    .enter().append('g')
      .attr('transform', (d, i) => `translate(0,${i * 25})`);

  legend.append('rect')
      .attr('x', width - 10)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', z);

  legend.append('text')
      .attr('x', width + 15)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
}