//#region Imports
import * as d3 from 'd3';
import type { Activation, activationFunctionIconGetter } from '../../../../utils/types';
import { getActivationLineOverlay } from './lineOverlay';

//#region Icons
import { getReluIcon } from './relu';
import { getLogisticIcon } from './logistic';
import { getShrinkIcon } from './shrink';
import { getThresholdIcon } from './threshold';
import { getSoftmaxIcon } from './softmax';
import { getGeneralIcon } from './general';
//#endregion
//#endregion

const iconMap: { [name: string]: activationFunctionIconGetter } = {
    "relu": getReluIcon,
    "logistic": getLogisticIcon,
    "shrink": getShrinkIcon,
    "threshold": getThresholdIcon,
    "softmax": getSoftmaxIcon,
    "other": getGeneralIcon,
};

export function getActivation(data: Activation, positionScaleFactor: number,
        nodeRadius: number, strokeOpacity: number, strokeWidth: number,
        minY: number, maxY: number, lineOverhang: number, iconScaleFactor: number,
        globalTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>): SVGGElement {
    let activationG = d3.create("svg:g");

    let lineY1 = maxY * positionScaleFactor + nodeRadius + lineOverhang;
    let lineY2 = minY * positionScaleFactor - nodeRadius - lineOverhang;
    let iconDimension = nodeRadius * iconScaleFactor;
    
    // TODO: Consider a warning or something here to the user
    if (!(data.category in iconMap)) {
        return activationG.node() as SVGGElement;
    }

    // Add dashed line overlay
    activationG.append(() => getActivationLineOverlay(data.xPosition, strokeOpacity, strokeWidth,
        positionScaleFactor, lineY1, lineY2));

    // Get activation icon
    let iconSelection = iconMap[data.category.toLowerCase()](data.xPosition, positionScaleFactor,
        iconDimension, lineY2)

    // Add tooltip
    iconSelection.on("mouseover", (event) => {
        globalTooltip.style('display', 'block')
            .html(data.function)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
        })
        .on("mousemove", (event) => {
            globalTooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", () => {
            globalTooltip.style("display", "none");
        });

    activationG.append(() => iconSelection.node() as SVGGElement);

    return activationG.node() as SVGGElement;
}