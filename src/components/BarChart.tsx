import { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component<
  { width: number; height: number; data: Array<number>; id: string },
  {}
> {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = this.props.data;

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .style("margin-left", 100);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (this.props.width / this.props.data.length))
      .attr("y", (d, i) => this.props.height * (d / 100))
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");
  }

  render() {
    return <div id={"#" + this.props.id}></div>;
  }
}

export default BarChart;
