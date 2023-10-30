import * as d3 from 'd3';

export function getReluG(name: string, data: { function: string, x: number },
        positionScaleFactor: number, nodeRadius: number, strokeOpacity: number,
        strokeWidth: number, minY: number, maxY: number, lineOverhang: number): SVGGElement {
    let lineY2 = minY * positionScaleFactor - nodeRadius - lineOverhang;
    let iconDimension = nodeRadius * 1.5;

    let reluG = d3.create("svg:g")

    // Add dashed line overlay
    // TODO: Separate this out into its own function
    reluG.append("line")
        .attr("class", "stroke-neutral-800 dark:stroke-neutral-400")
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-dasharray", "10, 10")
        .attr("x1", data.x * positionScaleFactor)
        .attr("y1", maxY * positionScaleFactor + nodeRadius + lineOverhang)
        .attr("x2", data.x * positionScaleFactor)
        .attr("y2", lineY2)

    // Add ReLU icon
    let relu = reluG.append("g")
        .attr("transform", `translate(${data.x * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    relu.append("rect")
        .attr("class", "fill-neutral-600 stroke-[0.58]")
        .attr("width", iconDimension)
        .attr("height", iconDimension)
        .attr("x", 0)
        .attr("y", 0)
        .attr("ry", 2.64);

    relu.append("path")
        .attr("class", "fill-none stroke-[url(#primarygradient)]")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", iconDimension * 0.07)
        .attr("d", `M ${iconDimension * 0.11},${iconDimension * 0.7} 
                    H ${iconDimension * 0.5} 
                    L ${iconDimension * 0.89},${iconDimension * 0.25}`);

    return reluG.node() as SVGGElement;
}