import * as d3 from 'd3';
import { isLinkCollection, isNodeCollection, type Link, type LinkCollection } from '../../../utils/types';

export function getVisibleLinks(links: (Link | LinkCollection)[], strokeWidth: number,
        strokeOpacity: number, strokeLinecap: string, positionScaleFactor: number,
        nodeRadius: number, nodeStrokeWidth: number, arrowName: string, multiMarkerName: string): SVGGElement {
    let visibleLinks = d3.create("svg:g")
        .attr("class", "visibleLinksContainer");
    
    visibleLinks.selectAll("g")
        .data(links)
        .join("g")
            .append((l) => isLinkCollection(l)
                ? getVisibleLinkCollection(l, strokeWidth, strokeOpacity, strokeLinecap,
                    positionScaleFactor, nodeRadius, nodeStrokeWidth, arrowName, multiMarkerName)
                : getVisibleLink(l, strokeWidth, strokeOpacity, strokeLinecap, 
                    positionScaleFactor, nodeRadius, nodeStrokeWidth, arrowName));

    return visibleLinks.node() as SVGGElement;
}

function getVisibleLink(link: Link, strokeWidth: number,
    strokeOpacity: number, strokeLinecap: string, positionScaleFactor: number,
    nodeRadius: number, nodeStrokeWidth: number, arrowName: string): SVGGElement {
    return d3.create("svg:line")
        .attr("class", getLinkColor(link.colorIndex))
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("x1", link.source.x * positionScaleFactor)
        .attr("y1", !isNodeCollection(link.source) ? link.source.y * positionScaleFactor : 0)
        .attr("x2", link.isInput
                ? link.target.x * positionScaleFactor -
                nodeRadius - 2 * nodeStrokeWidth - 2
                : link.target.x * positionScaleFactor
        )
        .attr("y2", !isNodeCollection(link.target) ? link.target.y * positionScaleFactor : 0)
        .attr("marker-end", (link.hasDirection ? `url(#${arrowName})` : null)).node() as SVGGElement;
}

function getVisibleLinkCollection(link: LinkCollection, strokeWidth: number,
    strokeOpacity: number, strokeLinecap: string, positionScaleFactor: number,
    nodeRadius: number, nodeStrokeWidth: number, arrowName: string, multiMarkerName: string): SVGGElement {
    return d3.create("svg:line")
        .attr("class", getLinkColor(link.colorIndex))
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("x1", link.source.x * positionScaleFactor)
        .attr("y1", !isNodeCollection(link.source) ? link.source.y * positionScaleFactor : 0)
        .attr("x2", link.isInput
                ? link.target.x * positionScaleFactor - nodeRadius - 2 * nodeStrokeWidth - 2
                : link.target.x * positionScaleFactor
        )
        .attr("y2", !isNodeCollection(link.target) ? link.target.y * positionScaleFactor : 0)
        .attr("marker-end", link.hasDirection ? `url(#${arrowName})` : isNodeCollection(link.target) ? `url(#${multiMarkerName})` : null)
        .attr("marker-start", isNodeCollection(link.source) ? `url(#${multiMarkerName})` : null)
        .node() as SVGGElement;
}

export function getLinkHoverAreas(links: (Link | LinkCollection)[], strokeWidth: number,
        strokeLinecap: string, positionScaleFactor: number,
        nodeRadius: number, nodeStrokeWidth: number, arrowName: string, multiMarkerName: string, 
        hoverScaleFactor: number, globalTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>): SVGGElement {
    let linkHoverAreas = d3.create("svg:g")
        .attr("class", "linkHoverAreasContainer");

    linkHoverAreas.selectAll("g")
            .data(links)
            .join("g")
            .append((l) => isLinkCollection(l)
                ? getLinkHoverAreaCollection(l, strokeWidth, hoverScaleFactor, strokeLinecap,
                    positionScaleFactor, nodeRadius, nodeStrokeWidth, arrowName, multiMarkerName, globalTooltip)
                : getLinkHoverArea(l, strokeWidth, hoverScaleFactor, strokeLinecap,
                    positionScaleFactor, nodeRadius, nodeStrokeWidth, arrowName, globalTooltip));

    return linkHoverAreas.node() as SVGGElement;
}

function getLinkHoverArea(link: Link, strokeWidth: number, hoverScaleFactor: number,
        strokeLinecap: string, positionScaleFactor: number, nodeRadius: number, nodeStrokeWidth: number,
        arrowName: string,
        globalTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>): SVGGElement {
    return d3.create("svg:line")
        .attr("class", "stroke-transparent fill-transparent")
        .attr("stroke-width", strokeWidth * hoverScaleFactor)
        .attr("stroke-linecap", strokeLinecap)
        .attr("x1", link.source.x * positionScaleFactor)
        .attr("y1", !isNodeCollection(link.source) ? link.source.y * positionScaleFactor : 0)
        .attr("x2", link.isInput
                ? link.target.x * positionScaleFactor - nodeRadius - 2 * nodeStrokeWidth
                : link.target.x * positionScaleFactor
        )
        .attr("y2", !isNodeCollection(link.target) ? link.target.y * positionScaleFactor : 0)
        .attr("marker-end", link.hasDirection ? `url(#${arrowName})` : null)
        .style("pointer-events", "all") // Capture hover events
        .on("mouseover", (event) => {
            const linkElement = d3.select(event.target);
            linkElement.attr("class", getLinkColor(link.colorIndex))
            globalTooltip.style('display', 'block')
                .html(link.hasDirection 
                    ? (link.isInput ? "Input" : "Output") 
                    : `Weight: ${link.weight.toFixed(3)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        })
        .on("mousemove", (event) => {
            globalTooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", (event) => {
            const linkElement = d3.select(event.target);
            linkElement.attr("class", "stroke-transparent fill-transparent");
            globalTooltip.style("display", "none");
        })
        .node() as SVGGElement;
}

function getLinkHoverAreaCollection(link: LinkCollection, strokeWidth: number,
    hoverScaleFactor: number, strokeLinecap: string, positionScaleFactor: number,
    nodeRadius: number, nodeStrokeWidth: number, arrowName: string,
    multiMarkerName: string, globalTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>): SVGGElement {
    return d3.create("svg:line")
        .attr("class", "stroke-transparent fill-transparent")
        .attr("stroke-width", strokeWidth * hoverScaleFactor)
        .attr("stroke-linecap", strokeLinecap)
        .attr("x1", link.source.x * positionScaleFactor)
        .attr("y1", !isNodeCollection(link.source) ? link.source.y * positionScaleFactor : 0)
        .attr("x2", link.isInput
                ? link.target.x * positionScaleFactor - nodeRadius - 2 * nodeStrokeWidth
                : link.target.x * positionScaleFactor
        )
        .attr("y2", !isNodeCollection(link.target) ? link.target.y * positionScaleFactor : 0)
        .attr("marker-end", link.hasDirection ? `url(#${arrowName})` : isNodeCollection(link.target) ? `url(#${multiMarkerName})` : null)
        .attr("marker-start", isNodeCollection(link.source) ? `url(#${multiMarkerName})` : null)
        .style("pointer-events", "all") // Capture hover events
        .on("mouseover", (event) => {
            const linkElement = d3.select(event.target);
            linkElement.attr("class", getLinkColor(link.colorIndex))
            globalTooltip.style('display', 'block')
                .html(link.hasDirection 
                    ? (link.isInput ? "Input" : "Output") 
                    : "Multiple links")
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        })
        .on("mousemove", (event) => {
            globalTooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", (event) => {
            const linkElement = d3.select(event.target);
            linkElement.attr("class", "stroke-transparent fill-transparent");
            globalTooltip.style("display", "none");
        })
        .node() as SVGGElement;
}

function getLinkColor(colorIndex: number) {
    const enumeratedValues: string[] = [
        "stroke-linkcolorgradientlight-50 dark:stroke-linkcolorgradientdark-50 fill-linkcolorgradientlight-50 dark:fill-linkcolorgradientdark-50",
        "stroke-linkcolorgradientlight-100 dark:stroke-linkcolorgradientdark-100 fill-linkcolorgradientlight-100 dark:fill-linkcolorgradientdark-100",
        "stroke-linkcolorgradientlight-200 dark:stroke-linkcolorgradientdark-200 fill-linkcolorgradientlight-200 dark:fill-linkcolorgradientdark-200",
        "stroke-linkcolorgradientlight-300 dark:stroke-linkcolorgradientdark-300 fill-linkcolorgradientlight-300 dark:fill-linkcolorgradientdark-300",
        "stroke-linkcolorgradientlight-400 dark:stroke-linkcolorgradientdark-400 fill-linkcolorgradientlight-400 dark:fill-linkcolorgradientdark-400",
        "stroke-linkcolorgradientlight-500 dark:stroke-linkcolorgradientdark-500 fill-linkcolorgradientlight-500 dark:fill-linkcolorgradientdark-500",
        "stroke-linkcolorgradientlight-600 dark:stroke-linkcolorgradientdark-600 fill-linkcolorgradientlight-600 dark:fill-linkcolorgradientdark-600",
        "stroke-linkcolorgradientlight-700 dark:stroke-linkcolorgradientdark-700 fill-linkcolorgradientlight-700 dark:fill-linkcolorgradientdark-700",
        "stroke-linkcolorgradientlight-800 dark:stroke-linkcolorgradientdark-800 fill-linkcolorgradientlight-800 dark:fill-linkcolorgradientdark-800",
        "stroke-linkcolorgradientlight-900 dark:stroke-linkcolorgradientdark-900 fill-linkcolorgradientlight-900 dark:fill-linkcolorgradientdark-900",
    ];

    const inputColorClass = "stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-400 dark:fill-neutral-400";

    if (colorIndex === -1) {
        return inputColorClass;
    }

    return enumeratedValues[colorIndex];
};