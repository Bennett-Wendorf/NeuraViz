import * as d3 from 'd3';
import { isNodeCollection, type Node, type NodeCollection } from '../../../utils/types';

export function getMainNodes(nodes: (Node | NodeCollection)[], layerNodeOffset: number, strokeWidth: number,
        strokeOpacity: number, radius: number, positionScaleFactor: number,
        scaledRadius: number, absoluteTanH: (x: number) => number,
        clickCallback: (event, data: Node) => void): SVGGElement {
    let mainNodes = d3.create("svg:g")
        .attr("class", "mainNodesContainer");

    mainNodes.selectAll("g")
        .data(nodes.filter((n) => !n.isInput))
        .join("g")
            .append((n) => isNodeCollection(n)
                ? getMainLayer(n, layerNodeOffset, strokeWidth, strokeOpacity, radius,
                    positionScaleFactor, scaledRadius, absoluteTanH, clickCallback)
                : getMainNode(n, strokeWidth, strokeOpacity, radius, 
                    positionScaleFactor, scaledRadius, absoluteTanH, clickCallback))
    
    return mainNodes.node() as SVGGElement;
}

function getMainNode(node: Node, strokeWidth: number,
    strokeOpacity: number, radius: number, positionScaleFactor: number,
    scaledRadius: number, absoluteTanH: (x: number) => number,
    clickCallback: (event, data: Node) => void): SVGGElement {
    let mainNode = d3.create("svg:circle")
        .attr("class", `stroke-black ${isNodeCollection(node)
            ? "fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900"
            : getNodeColor(node.bias, absoluteTanH)}`)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("r", radius)
        .attr("cx", node.x * positionScaleFactor)
        .attr("cy", node.y * positionScaleFactor)
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

    return mainNode.node() as SVGGElement;
}

function getMainLayer(node: NodeCollection, layerNodeOffset: number, strokeWidth: number,
    strokeOpacity: number, radius: number, positionScaleFactor: number,
    scaledRadius: number, absoluteTanH: (x: number) => number,
    clickCallback: (event, data: Node) => void): SVGGElement {
    let mainLayer = d3.create("svg:g")
        .attr("class", "mainLayerContainer");

    let bottomCircle = mainLayer.append("circle")
        .attr("class", "stroke-black fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900")
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("r", radius)
        .attr("cx", node.x * positionScaleFactor - layerNodeOffset)
        .attr("cy", -layerNodeOffset);

    let middleCircle = mainLayer.append("circle")
        .attr("class", "stroke-black fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900")
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("r", radius)
        .attr("cx", node.x * positionScaleFactor)
        .attr("cy", 0);

    let topCircle = mainLayer.append("circle")
        .attr("class", "stroke-black fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900")
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth)
        .attr("r", radius)
        .attr("cx", node.x * positionScaleFactor + layerNodeOffset)
        .attr("cy", layerNodeOffset);

    mainLayer
        .on("mouseover", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("style", "cursor: pointer;")

            bottomCircle.attr("r", scaledRadius);
            middleCircle.attr("r", scaledRadius);
            topCircle.attr("r", scaledRadius);
        })
        .on("mouseout", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("style", "cursor: default;")

            bottomCircle.attr("r", radius);
            middleCircle.attr("r", radius);
            topCircle.attr("r", radius);
        })
        .on("click", clickCallback)

    return mainLayer.node() as SVGGElement;
}

export function getInputNodes(nodes: (Node | NodeCollection)[], layerNodeOffset: number, radius: number,
        mainNodeRadius: number, mainNodeScaledRadius: number,
        positionScaleFactor: number, clickCallback: (event, data: Node) => void): SVGGElement {
    let inputNodes = d3.create("svg:g")
        .attr("class", "inputNodesContainer");

    inputNodes.selectAll("g")
    .data(nodes.filter((n) => n.isInput))
        .join("g")
            .append((n) => isNodeCollection(n)
            ? getInputLayer(n, layerNodeOffset, radius, mainNodeRadius, mainNodeScaledRadius, positionScaleFactor, clickCallback)
            : getInputNode(n, radius, mainNodeRadius, mainNodeScaledRadius, positionScaleFactor, clickCallback))
    
    return inputNodes.node() as SVGGElement;
}

function getInputNode(node: Node, radius: number,
    mainNodeRadius: number, mainNodeScaledRadius: number,
    positionScaleFactor: number, clickCallback: (event, data: Node) => void): SVGGElement {
    let inputNode = d3.create("svg:rect")

    inputNode.attr("class", () => `stroke-black fill-neutral-400 dark:fill-neutral-600`)
        .attr("x", node.x * positionScaleFactor - mainNodeRadius)
        .attr("y", node.y * positionScaleFactor - mainNodeRadius)
        .attr("width", mainNodeRadius * 2)
        .attr("height", mainNodeRadius * 2)
        .attr("rx", radius)
        .on("mouseover", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("x", node.x * positionScaleFactor - mainNodeScaledRadius);
            nodeElement.attr("y", node.y * positionScaleFactor - mainNodeScaledRadius);
            nodeElement.attr("width", mainNodeScaledRadius * 2);
            nodeElement.attr("height", mainNodeScaledRadius * 2);
            nodeElement.attr("style", "cursor: pointer;")
        })
        .on("mouseout", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("x", node.x * positionScaleFactor - mainNodeRadius);
            nodeElement.attr("y", node.y * positionScaleFactor - mainNodeRadius);
            nodeElement.attr("width", mainNodeRadius * 2);
            nodeElement.attr("height", mainNodeRadius * 2);
            nodeElement.attr("style", "cursor: default;")
        })
        .on("click", clickCallback)

    return inputNode.node() as SVGGElement;
}

function getInputLayer(node: NodeCollection, layerNodeOffset: number, radius: number,
    mainNodeRadius: number, mainNodeScaledRadius: number,
    positionScaleFactor: number, clickCallback: (event, data: Node) => void): SVGGElement {
    let inputLayer = d3.create("svg:g")
        .attr("class", "inputLayerContainer");

    let bottomRect = inputLayer.append("rect")
        .attr("class", "stroke-black fill-neutral-400 dark:fill-neutral-600")
        .attr("x", node.x * positionScaleFactor - mainNodeRadius - layerNodeOffset)
        .attr("y", 0 - mainNodeRadius - layerNodeOffset)
        .attr("width", mainNodeRadius * 2)
        .attr("height", mainNodeRadius * 2)
        .attr("rx", radius);

    let middleRect = inputLayer.append("rect")
        .attr("class", "stroke-black fill-neutral-400 dark:fill-neutral-600")
        .attr("x", node.x * positionScaleFactor - mainNodeRadius)
        .attr("y", 0 - mainNodeRadius)
        .attr("width", mainNodeRadius * 2)
        .attr("height", mainNodeRadius * 2)
        .attr("rx", radius);

    let topRect = inputLayer.append("rect")
        .attr("class", "stroke-black fill-neutral-400 dark:fill-neutral-600")
        .attr("x", node.x * positionScaleFactor - mainNodeRadius + layerNodeOffset)
        .attr("y", 0 - mainNodeRadius + layerNodeOffset)
        .attr("width", mainNodeRadius * 2)
        .attr("height", mainNodeRadius * 2)
        .attr("rx", radius);

    inputLayer
        .on("mouseover", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("style", "cursor: pointer;")

            bottomRect.attr("x", node.x * positionScaleFactor - mainNodeScaledRadius - layerNodeOffset);
            bottomRect.attr("y", 0 - mainNodeScaledRadius - layerNodeOffset);
            middleRect.attr("x", node.x * positionScaleFactor - mainNodeScaledRadius);
            middleRect.attr("y", 0 - mainNodeScaledRadius);
            topRect.attr("x", node.x * positionScaleFactor - mainNodeScaledRadius + layerNodeOffset);
            topRect.attr("y", 0 - mainNodeScaledRadius + layerNodeOffset);

            bottomRect.attr("width", mainNodeScaledRadius * 2);
            bottomRect.attr("height", mainNodeScaledRadius * 2);
            middleRect.attr("width", mainNodeScaledRadius * 2);
            middleRect.attr("height", mainNodeScaledRadius * 2);
            topRect.attr("width", mainNodeScaledRadius * 2);
            topRect.attr("height", mainNodeScaledRadius * 2);
        })
        .on("mouseout", (event) => {
            let nodeElement = d3.select(event.target);
            nodeElement.attr("style", "cursor: default;")

            bottomRect.attr("x", node.x * positionScaleFactor - mainNodeRadius - layerNodeOffset);
            bottomRect.attr("y", 0 - mainNodeRadius - layerNodeOffset);
            middleRect.attr("x", node.x * positionScaleFactor - mainNodeRadius);
            middleRect.attr("y", 0 - mainNodeRadius);
            topRect.attr("x", node.x * positionScaleFactor - mainNodeRadius + layerNodeOffset);
            topRect.attr("y", 0 - mainNodeRadius + layerNodeOffset);

            bottomRect.attr("width", mainNodeRadius * 2);
            bottomRect.attr("height", mainNodeRadius * 2);
            middleRect.attr("width", mainNodeRadius * 2);
            middleRect.attr("height", mainNodeRadius * 2);
            topRect.attr("width", mainNodeRadius * 2);
            topRect.attr("height", mainNodeRadius * 2);
        })
        .on("click", clickCallback)
    
    return inputLayer.node() as SVGGElement;
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