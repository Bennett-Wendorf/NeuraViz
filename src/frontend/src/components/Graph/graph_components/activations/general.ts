import * as d3 from 'd3';
import { getBackgroundRect } from './backgroundRect';

export function getGeneralIcon(xPosition: number, positionScaleFactor: number, 
    iconDimension: number, lineY2: number): d3.Selection<Element, undefined, null, undefined> {
    let generalIcon = d3.create("svg:g")
        .attr("transform", `translate(${xPosition * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    // Add icon background
    generalIcon.append(() => getBackgroundRect(iconDimension))

    // Add icon foreground
    generalIcon.append("text")
        .attr("class", "fill-[url(#primarylightgradient)] dark:fill-[url(#primarydarkgradient)] font-bold text-xs tracking-widest")
        .attr("x", iconDimension * 0.21)
        .attr("y", iconDimension * 0.7)
        .html("fX")

    return generalIcon;
}