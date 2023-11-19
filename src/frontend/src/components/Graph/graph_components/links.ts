import * as d3 from 'd3';
import { isLinkCollection, type Link, type LinkCollection } from '../../../utils/types';

export function getVisibleLinks(links: (Link | LinkCollection)[], strokeWidth: number,
        strokeOpacity: number, strokeLinecap: string, positionScaleFactor: number,
        nodeRadius: number, nodeStrokeWidth: number, arrowName: string,
        absoluteTanH: (x: number) => number): SVGGElement {
    let visibleLinks = d3.create("svg:g")
        .attr("class", "visibleLinksContainer");
    
    visibleLinks.selectAll("line")
        .data(links)
        .join("line")
            .attr("class", (l) =>
                l.hasDirection
                    ? "stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-400 dark:fill-neutral-400"
                    : isLinkCollection(l)
                        ? "stroke-linkcolorgradientlight-900 dark:stroke-linkcolorgradientdark-900 fill-linkcolorgradientlight-900 dark:fill-linkcolorgradientdark-900"
                        : getLinkColor(l.weight, absoluteTanH)
            )
            .attr("stroke-width", strokeWidth)
            .attr("stroke-opacity", strokeOpacity)
            .attr("stroke-linecap", strokeLinecap)
            .attr("x1", (l) => l.source.x * positionScaleFactor)
            .attr("y1", (l) => l.source.y * positionScaleFactor)
            .attr("x2", (l) =>
                l.isInput
                    ? l.target.x * positionScaleFactor -
                      nodeRadius - 2 * nodeStrokeWidth - 2
                    : l.target.x * positionScaleFactor
            )
            .attr("y2", (l) => l.target.y * positionScaleFactor)
            .attr("marker-end", (l) => (l.hasDirection ? `url(#${arrowName})` : null));

    return visibleLinks.node() as SVGGElement;
}

export function getLinkHoverAreas(links: (Link | LinkCollection)[], strokeWidth: number,
        strokeLinecap: string, positionScaleFactor: number,
        nodeRadius: number, nodeStrokeWidth: number, arrowName: string,
        absoluteTanH: (x: number) => number, hoverScaleFactor: number,
        globalTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>): SVGGElement {
    let linkHoverAreas = d3.create("svg:g")
        .attr("class", "linkHoverAreasContainer");

    linkHoverAreas.selectAll(".linkHoverAreas")
            .data(links)
            .join("line")
            .attr("class", "stroke-transparent fill-transparent")
            .attr("stroke-width", strokeWidth * hoverScaleFactor)
            .attr("stroke-linecap", strokeLinecap)
            .attr("x1", (l) => l.source.x * positionScaleFactor)
            .attr("y1", (l) => l.source.y * positionScaleFactor)
            .attr("x2", (l) =>
                l.isInput
                    ? l.target.x * positionScaleFactor - nodeRadius - 2 * nodeStrokeWidth
                    : l.target.x * positionScaleFactor
            )
            .attr("y2", (l) => l.target.y * positionScaleFactor)
            .attr("marker-end", (l) => (l.hasDirection ? `url(#${arrowName})` : null))
            .style("pointer-events", "all") // Capture hover events
            .on("mouseover", (event, d) => {
                const linkElement = d3.select(event.target);
                linkElement.attr("class", d.hasDirection 
                    ? "stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-400 dark:fill-neutral-400" 
                    : isLinkCollection(d)
                        ? "stroke-linkcolorgradientlight-900 dark:stroke-linkcolorgradientdark-900 fill-linkcolorgradientlight-900 dark:fill-linkcolorgradientdark-900"
                        : getLinkColor(d.weight, absoluteTanH))
                globalTooltip.style('display', 'block')
                    .html(d.hasDirection 
                        ? (d.isInput ? "Input" : "Output") 
                        : isLinkCollection(d)
                            ? "Multiple links"
                            : `Weight: ${d.weight.toFixed(3)}`)
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
            });

    return linkHoverAreas.node() as SVGGElement;
}

const getLinkColor = (value: number, absoluteTanH: (x: number) => number) => {
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

    return enumeratedValues[
        Math.round(
            absoluteTanH(value) * (enumeratedValues.length - 1)
        )
    ];
};