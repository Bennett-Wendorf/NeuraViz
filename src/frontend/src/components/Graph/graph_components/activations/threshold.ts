import * as d3 from 'd3';
import { getBackgroundRect } from './backgroundRect';

export function getThresholdIcon(xPosition: number, positionScaleFactor: number, 
    iconDimension: number, lineY2: number): d3.Selection<Element, undefined, null, undefined> {
    let thresholdIcon = d3.create("svg:g")
        .attr("transform", `translate(${xPosition * positionScaleFactor - (iconDimension / 2)}, ${lineY2 - (iconDimension * 0.95)})`)

    // Add icon background
    thresholdIcon.append(() => getBackgroundRect(iconDimension))

    // Add icon foreground
    thresholdIcon.append("path")
        .attr("class", "fill-none stroke-[url(#primarylightgradient)] dark:stroke-[url(#primarydarkgradient)]")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", iconDimension * 0.07)
        .attr("d", `M ${iconDimension * 0.11},${iconDimension * 0.7} 
                    C ${iconDimension * 0.4},${iconDimension * 0.4} ${iconDimension * 0.5},${iconDimension * 0.3} ${iconDimension * 0.89},${iconDimension * 0.3}`);

    return thresholdIcon;
}