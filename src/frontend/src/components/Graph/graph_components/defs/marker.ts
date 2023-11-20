import * as d3 from 'd3';

export function getArrowhead(arrowName: string, strokeWidth: number, strokeOpacity: number): SVGMarkerElement {
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
        .attr("stroke-opacity", strokeOpacity)
        .attr("fill-opacity", strokeOpacity)
        .attr("fill", "context-fill");

    return marker.node() as SVGMarkerElement;
}

export function getMultiMarker(markerName: string, strokeWidth: number, strokeLinecap: string,
    strokeOpacity: number, refX: number, refY: number): SVGMarkerElement {
    let marker = d3.create("svg:marker")
        .attr("id", markerName)
        .attr("refX", refX)
        .attr("refY", refY)
        .attr("markerWidth", 10)
        .attr("markerHeight", 20)
        .attr("orient", "auto-start-reverse")

    marker.append("line")
        .attr("x1", 5)
        .attr("y1", 8)
        .attr("x2", 5)
        .attr("y2", 12)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke", "context-fill");

    return marker.node() as SVGMarkerElement;
}