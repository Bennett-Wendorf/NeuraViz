import * as d3 from 'd3';

export function getBackgroundRect(iconDimension: number): SVGRectElement {
    return d3.create("svg:rect")
        .attr("class", "fill-neutral-400 dark:fill-neutral-600 stroke-[0.58]")
        .attr("width", iconDimension)
        .attr("height", iconDimension)
        .attr("x", 0)
        .attr("y", 0)
        .attr("ry", 2.64)
        .node() as SVGRectElement;
}