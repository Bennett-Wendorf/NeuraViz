import * as d3 from 'd3';
import { getBackgroundRect } from './backgroundRect';

export function getLogisticIcon(xPosition: number, positionScaleFactor: number, 
    iconDimension: number, lineY2: number): d3.Selection<Element, undefined, null, undefined> {
    let logisticIcon = d3.create("svg:g")
        .attr("transform", `translate(${xPosition * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    // Add icon background
    logisticIcon.append(() => getBackgroundRect(iconDimension))

    // Add icon foreground
    logisticIcon.append("path")
        .attr("class", "fill-none stroke-[url(#primarygradient)]")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", iconDimension * 0.07)
        .attr("d", `M ${iconDimension * 0.11},${iconDimension * 0.75}
                    C ${iconDimension * 0.7},${iconDimension * 0.75} ${iconDimension * 0.3},${iconDimension * 0.25} ${iconDimension * 0.89},${iconDimension * 0.25}`)

    return logisticIcon;
}