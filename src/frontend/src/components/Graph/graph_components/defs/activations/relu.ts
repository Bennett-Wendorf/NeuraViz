import * as d3 from 'd3';

export function getReluMarker(markerName: string, colorGradientName: string): SVGMarkerElement {
    let relu = d3.create("svg:marker")
        .attr("id", markerName)
        .attr("viewBox", [0, 0, 40, 40])
        .attr("refX", 8.5)
        .attr("refY", 16)
        .attr("markerWidth", 40)
        .attr("markerHeight", 40);

    relu.append("rect")
        .attr("class", "fill-neutral-600 stroke-[0.58]")
        .attr("width", 17)
        .attr("height", 17)
        .attr("x", 0)
        .attr("y", 0)
        .attr("ry", 2.64);

    relu.append("path")
        .attr("class", `fill-none stroke-[url(#${colorGradientName})] stroke-[1.2]`)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("d", "M 1.7197917,11.90625 H 8.5 L 14.948958,3.9687503");

    return relu.node() as SVGMarkerElement;
}