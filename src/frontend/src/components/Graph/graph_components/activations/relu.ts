import * as d3 from 'd3';

export function getReluIcon(xPosition: number, positionScaleFactor: number, 
    iconDimension: number, lineY2: number): d3.Selection<Element, undefined, null, undefined> {
    let reluIcon = d3.create("svg:g")
        .attr("transform", `translate(${xPosition * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    // Add icon background
    reluIcon.append("rect")
        .attr("class", "fill-neutral-600 stroke-[0.58]")
        .attr("width", iconDimension)
        .attr("height", iconDimension)
        .attr("x", 0)
        .attr("y", 0)
        .attr("ry", 2.64);

    // Add icon foreground
    reluIcon.append("path")
        .attr("class", "fill-none stroke-[url(#primarygradient)]")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", iconDimension * 0.07)
        .attr("d", `M ${iconDimension * 0.11},${iconDimension * 0.7} 
                    H ${iconDimension * 0.5} 
                    L ${iconDimension * 0.89},${iconDimension * 0.25}`);

    return reluIcon;
}