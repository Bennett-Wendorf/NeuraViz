import * as d3 from 'd3';

export function getPrimaryGradient(gradientName: string, stopColor1: string, stopColor2: string): SVGLinearGradientElement {
    let gradient = d3.create("svg:linearGradient")
        .append("linearGradient")
        .attr("id", gradientName)
        .attr("x1", 1.5)
        .attr("y1", 7)
        .attr("x2", 15)
        .attr("y2", 7)
        .attr("gradientUnits", "userSpaceOnUse");

    gradient
        .append("stop")
        .attr("style", `stop-color: ${stopColor1}; stop-opacity: 1`)
        .attr("offset", 0);

    gradient
        .append("stop")
        .attr("style", `stop-color: ${stopColor2}; stop-opacity: 1`)
        .attr("offset", 1);

    return gradient.node() as SVGLinearGradientElement;
}