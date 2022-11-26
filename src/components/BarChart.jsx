import React, { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import { BarChartContext } from "../App";

const BarChartContainer = styled.div`
  border-radius: 10px;
  width: clamp(200px, 60vw, 800px);
  height: 400px;
  margin-left: -35px;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  margin: 0 1rem 4rem 1rem;
  line-height: 45px;
  font-size: clamp(2.5rem, 5vw, 3rem);
`;

const AnimatedSpan = styled.span`
  animation: fadeIn;
  animation-duration: 2s;
  color: blue;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  animation: fadeIn;
  animation-duration: 1s;
  overflow: visible !important;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const BarChart = () => {
  const { data, setData, currentData } = useContext(BarChartContext);
  const GDPChart = useRef();

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = d3.select(GDPChart.current);
    if (!dimensions) return;

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.Year))
      .range([0, dimensions.width])
      .padding(0.4);

    const colorScale = d3
      .scaleLinear()
      .domain([d3.min(data.map((d) => d.GDP)), d3.max(data.map((d) => d.GDP))])
      .range(["#cfcfff", "#1500ff"]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data.map((d) => d.GDP)), d3.max(data.map((d) => d.GDP))])
      .range([dimensions.height, 0])
      .nice();

    const xAxis = d3
      .axisBottom(xScale)

      .tickValues(
        xScale.domain().filter(function (d, i) {
          const MIN_WIDTH = 70;
          let skip = Math.round((MIN_WIDTH * data.length) / dimensions.width);
          skip = Math.max(5, skip);
          return !(i % skip);
        })
      )
      .tickPadding(20);
    svg
      .select(".x-axis")
      .style("transform", `translate(50px,${dimensions.height}px)`)
      .attr("font-family", "Inter")
      .attr("font-size", "1rem")
      .attr("color", "#615b5b")
      .transition()
      .duration(300)
      .call(xAxis);

    svg.select(".x-axis").select("path").remove(); //removes outer ticks

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(8)

      .tickSize(-dimensions.width - 50)
      .tickFormat((d) =>
        currentData.type === "GDP Growth" ? d + "%" : d3.format("$,.2s")(d)
      );
    svg
      .select(".y-axis")
      .attr("font-family", "Inter")
      .attr("font-size", "0.9rem")
      .attr("color", "#615b5b")
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "2,2")
      )
      .call((g) => g.selectAll(".tick text").attr("x", 35).attr("dy", -7));

    let div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("left", "0px")
      .style("top", "0px");

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("rx", 1)
      .attr("x", (value) => xScale(value.Year) + 50)
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "greenyellow");
        div.transition().duration(200).style("opacity", 1);
        div
          .html(
            `<span style="font-size:1rem">${d.Year}</span>` +
              "<br/>" +
              `${
                currentData.type === "GDP Growth"
                  ? `<span style="font-weight:600;font-size:1.2rem">${
                      d.GDP.toPrecision(3) + "%"
                    }</span>`
                  : `<span style="font-weight:600;font-size:1.2rem">${d3.format(
                      "$,.2s"
                    )(d.GDP)}</span>`
              }`
          )
          .style("left", event.pageX - 40 + "px")
          .style("top", event.pageY - 100 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", (d) => colorScale(d.GDP));
        div.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .attr("height", (value) => dimensions.height - yScale(value.GDP))
      .attr("fill", (d) => colorScale(d.GDP));

    return () => {
      div.remove();
    };
  }, [currentData.type, data, dimensions]);

  useEffect(() => {
    const row = (d) => {
      d.Year = +d.Year;
      d.GDP = +d.GDP;
      return d;
    };
    d3.csv(currentData.URL, row).then(setData);
  }, [currentData, setData]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <Title>
        World{" "}
        <AnimatedSpan key={currentData.type}>{currentData.type}</AnimatedSpan>{" "}
        {currentData.type === "GDP Growth" ? "Since 1961" : "in $"}
      </Title>
      <BarChartContainer ref={wrapperRef}>
        <ChartSvg ref={GDPChart}>
          <g className="x-axis" />
          <g className="y-axis" />
        </ChartSvg>
      </BarChartContainer>
    </Wrapper>
  );
};

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default BarChart;
