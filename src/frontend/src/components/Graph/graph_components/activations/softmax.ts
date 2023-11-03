import * as d3 from 'd3';
import { getBackgroundRect } from './backgroundRect';

export function getSoftmaxIcon(xPosition: number, positionScaleFactor: number, 
    iconDimension: number, lineY2: number): d3.Selection<Element, undefined, null, undefined> {
    let softmaxIcon = d3.create("svg:g")
        .attr("transform", `translate(${xPosition * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    // Add icon background
    softmaxIcon.append(() => getBackgroundRect(iconDimension))

    // Add icon foreground
    softmaxIcon.append("text")
        .attr("class", "fill-[url(#primarygradient)] font-bold text-xs text-center")
        .attr("x", iconDimension * 0.11)
        .attr("y", iconDimension * 0.65)
        .html("sm")

    return softmaxIcon;
}