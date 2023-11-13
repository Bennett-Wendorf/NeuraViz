import * as d3 from 'd3';
import * as tailwindConfig from '../../../../../tailwind.config.cjs';

const customColors = tailwindConfig.theme.extend.colors;

export function getPrimaryLightGradient(gradientName: string): SVGLinearGradientElement {
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
        .attr("style", `stop-color: ${customColors.primary[50]}; stop-opacity: 1`)
        .attr("offset", 0);

    gradient
        .append("stop")
        .attr("style", `stop-color: ${customColors.primary[300]}; stop-opacity: 1`)
        .attr("offset", 1);

    return gradient.node() as SVGLinearGradientElement;
}

export function getPrimaryDarkGradient(gradientName: string): SVGLinearGradientElement {
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
        .attr("style", `stop-color: ${customColors.primary[200]}; stop-opacity: 1`)
        .attr("offset", 0);

    gradient
        .append("stop")
        .attr("style", `stop-color: ${customColors.primary[600]}; stop-opacity: 1`)
        .attr("offset", 1);

    return gradient.node() as SVGLinearGradientElement;
}