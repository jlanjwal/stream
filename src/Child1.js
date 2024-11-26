import React, { Component } from "react";
import "./Child1.css";
import * as d3 from "d3";

class Child1 extends Component {
  componentDidUpdate() {
    const data = this.props.csv_data;
    const maxSum = d3.sum([
      d3.max(data, d => d.GPT4),
      d3.max(data, d => d.Gemini),
      d3.max(data, d => d.PaLM2),
      d3.max(data, d => d.Claude),
      d3.max(data, d => d.LLaMA31)
    ]);

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 400,
      height = 400,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select('#mysvg').attr('width', width).attr('height', height).select('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    var xScale = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, innerWidth]);
    var yScale = d3.scaleLinear().domain([0, maxSum]).range([innerHeight, 0]);
    var colors = {'GPT4': '#E41A1C', 'Gemini': '#377EB8', 'PaLM2':'#4DAF4A', 'Claude': '#984EA3', 'LLaMA31': '#FF7F00'};

    var stack = d3.stack().keys(['GPT4', 'Gemini', 'PaLM2', 'Claude', 'LLaMA31']).offset(d3.stackOffsetWiggle);
    var stackedSeries = stack(data);

    var areaGenerator = d3.area().x(d => xScale(d.data.Date)).y0(d => yScale(d[0]) - 50).y1(d => yScale(d[1]) - 50).curve(d3.curveCardinal);

    d3.select('.container').selectAll('path').data(stackedSeries).join('path').attr('class', 'stream').style('fill', (d) => colors[d.key]).attr('d', d=>areaGenerator(d));

    svg.selectAll('.x.axis').data([null]).join('g').attr('class', 'x axis').attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat('%b')));

    const legendSvg = d3.select('#legend').attr("height", "300").select('g');

    legendSvg.append("rect").attr('fill', "#FF7F00").attr("height", '20px').attr("width", "20px").attr("x", "0").attr("y", "80");
    legendSvg.append("text").text("LLaMA-3.1").attr('x', "25").attr("y", "95");

    legendSvg.append("rect").attr('fill', "#984EA3").attr("height", '20px').attr("width", "20px").attr("x", "0").attr("y", "110");
    legendSvg.append("text").text("Claude").attr('x', "25").attr("y", "125");

    legendSvg.append("rect").attr('fill', "#4DAF4A").attr("height", '20px').attr("width", "20px").attr("x", "0").attr("y", "140");
    legendSvg.append("text").text("PaLM-2").attr('x', "25").attr("y", "155");

    legendSvg.append("rect").attr('fill', "#377EB8").attr("height", '20px').attr("width", "20px").attr("x", "0").attr("y", "170");
    legendSvg.append("text").text("Gemini").attr('x', "25").attr("y", "185");

    legendSvg.append("rect").attr('fill', "#E41A1C").attr("height", '20px').attr("width", "20px").attr("x", "0").attr("y", "200");
    legendSvg.append("text").text("GPT4").attr('x', "25").attr("y", "215");

    const tooltip = d3.select('.tooltip')
    const barwidth = 400,
      barheight = 200,
      barinnerWidth = barwidth - margin.left - margin.right,
      barinnerHeight = barheight - margin.top - margin.bottom;

    const barsvg = d3.select('#barchart').attr('width', barwidth).attr('height', barheight).select('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    var barxScale = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, barinnerWidth]);
    barsvg.selectAll(".x_axis_g2").data([0]).join('g').attr("class", 'x_axis_g2')
      .attr("transform", `translate(15, ${barinnerHeight})`).call(d3.axisBottom(barxScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat('%b')));;

    d3.selectAll('.stream')
      .on('mouseover', (ev, d) => {
        var baryScale = d3.scaleLinear().domain([0, d3.max(data, temp => temp[d.key])]).range([barinnerHeight, 0]);
        barsvg.selectAll(".y_axis_g2").data([0]).join('g').attr("class", 'y_axis_g2')
          .attr("transform", `translate(-10, 0)`).call(d3.axisLeft(baryScale));

        barsvg.selectAll("rect")
          .data(d)
          .join("rect")
          .attr("x", function (t) {
            return barxScale(t.data.Date);
          })
          .attr("y", function (t) {
            return baryScale(t.data[d.key]);
          })
          .attr("width", 30)
          .attr("height", function (t) {
            return barinnerHeight - baryScale(t.data[d.key])
          })
          .style("fill", t => colors[d.key]);
        tooltip.style('visibility', 'visible')
      })
      .on('mousemove', (ev) => {
        tooltip.style('top', (ev.pageY + 5) + 'px')
          .style('left', (ev.pageX + 5) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }

  render() {
    return (
        <div className='child1'>
            <svg id="mysvg" width="700" height="400">
                <g className="container"></g>
            </svg>
            <svg id="legend" width="100" height="400"><g></g></svg>
            <div className="tooltip">
              <svg id="barchart"><g></g></svg>
            </div>
        </div>
    );
  }
}

export default Child1;