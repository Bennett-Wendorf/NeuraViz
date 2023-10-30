import * as d3 from 'd3';

export function getArrowhead(arrowName: string, strokeWidth: number): SVGMarkerElement {
    let marker = d3.create("svg:marker")
        .attr("id", arrowName)
        .attr("viewBox", [0, 0, 40, 40])
        .attr("refX", 14)
        .attr("refY", 10)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto-start-reverse")
    
    marker.append("path")
        .attr("d", "M 0 0 L 20 10 L 0 20 L 0 16 L 13 10 L 0 4 z")
        .attr("stroke-width", strokeWidth)
        .attr("fill", "context-fill").node();

    return marker.node() as SVGMarkerElement;
}