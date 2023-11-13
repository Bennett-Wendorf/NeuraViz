import * as d3 from 'd3';

export function getActivationLineOverlay(xPosition: number, strokeOpacity: number,
        strokeWidth: number, positionScaleFactor: number, y1: number, y2: number): SVGLineElement {
    let x = xPosition * positionScaleFactor;
    
    return d3.create("svg:line")
        .attr("class", "stroke-neutral-800 dark:stroke-neutral-400")
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-dasharray", "10, 10")
        .attr("x1", x)
        .attr("y1", y1)
        .attr("x2", x)
        .attr("y2", y2)
        .node() as SVGLineElement;
}