import * as d3 from 'd3';
import type { Node } from '../../../utils/types';

export function getMainNodes(nodes: Node[], strokeWidth: number,
        strokeOpacity: number, radius: number, positionScaleFactor: number,
        scaledRadius: number, absoluteTanH: (x: number) => number,
        clickCallback: (event, data: Node) => void): SVGGElement {
    let mainNodes = d3.create("svg:g")
        .attr("class", "mainNodesContainer");

    mainNodes.selectAll("circle")
        .data(nodes.filter((n) => !n.isInput))
        .join("circle")
            .attr("class", (n) => `stroke-black ${getNodeColor(n.bias, absoluteTanH)}`)
            .attr("stroke-opacity", strokeOpacity)
            .attr("stroke-width", strokeWidth)
            .attr("r", radius)
            .attr("cx", (n) => n.x * positionScaleFactor)
            .attr("cy", (n) => n.y * positionScaleFactor)
            .on("mouseover", (event, _) => {
                let nodeElement = d3.select(event.target);
                nodeElement.attr("r", scaledRadius)
                nodeElement.attr("style", "cursor: pointer;")
            })
            .on("mouseout", (event) => {
                let nodeElement = d3.select(event.target);
                nodeElement.attr("r", radius)
                nodeElement.attr("style", "cursor: default;")
            })
            .on("click", clickCallback)
    
    return mainNodes.node() as SVGGElement;
}

export function getInputNodes(nodes: Node[], radius: number,
        mainNodeRadius: number, mainNodeScaledRadius: number,
        positionScaleFactor: number, clickCallback: (event, data: Node) => void): SVGGElement {
    let inputNodes = d3.create("svg:g")
        .attr("class", "inputNodesContainer");

    inputNodes.selectAll("rect")
    .data(nodes.filter((n) => n.isInput))
        .join("rect")
        .attr("class", () => `stroke-black fill-neutral-400 dark:fill-neutral-600`)
        .attr("x", (n) => n.x * positionScaleFactor - mainNodeRadius)
        .attr("y", (n) => n.y * positionScaleFactor - mainNodeRadius)
        .attr("width", mainNodeRadius * 2)
        .attr("height", mainNodeRadius * 2)
        .attr("rx", radius)
        .on("mouseover", (event, d) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("x", d.x * positionScaleFactor - mainNodeScaledRadius);
            nodeElement.attr("y", d.y * positionScaleFactor - mainNodeScaledRadius);
            nodeElement.attr("width", mainNodeScaledRadius * 2);
            nodeElement.attr("height", mainNodeScaledRadius * 2);
            nodeElement.attr("style", "cursor: pointer;")
        })
        .on("mouseout", (event, d) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("x", d.x * positionScaleFactor - mainNodeRadius);
            nodeElement.attr("y", d.y * positionScaleFactor - mainNodeRadius);
            nodeElement.attr("width", mainNodeRadius * 2);
            nodeElement.attr("height", mainNodeRadius * 2);
            nodeElement.attr("style", "cursor: default;")
        })
        .on("click", clickCallback)
    
    return inputNodes.node() as SVGGElement;
}

function getNodeColor (value: number, absoluteTanH: (x: number) => number) {
    const enumeratedValues: string[] = [
        "fill-nodecolorgradientlight-50 dark:fill-nodecolorgradientdark-50",
        "fill-nodecolorgradientlight-100 dark:fill-nodecolorgradientdark-100",
        "fill-nodecolorgradientlight-200 dark:fill-nodecolorgradientdark-200",
        "fill-nodecolorgradientlight-300 dark:fill-nodecolorgradientdark-300",
        "fill-nodecolorgradientlight-400 dark:fill-nodecolorgradientdark-400",
        "fill-nodecolorgradientlight-500 dark:fill-nodecolorgradientdark-500",
        "fill-nodecolorgradientlight-600 dark:fill-nodecolorgradientdark-600",
        "fill-nodecolorgradientlight-700 dark:fill-nodecolorgradientdark-700",
        "fill-nodecolorgradientlight-800 dark:fill-nodecolorgradientdark-800",
        "fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900",
    ];

    return enumeratedValues[
        Math.round(
            absoluteTanH(value) * (enumeratedValues.length - 1)
        )
    ];
};