<script lang="ts">
    import * as d3 from 'd3';
    import { Button, Spinner, Tooltip } from 'flowbite-svelte';
    import { afterUpdate } from 'svelte';
    import { MagnifyingGlassPlus, MagnifyingGlassMinus, MapPin } from 'svelte-heros-v2'
    import { fade } from 'svelte/transition';
    import { graph, uploading } from '../../utils/stores';
    import { absoluteTanH, getScaledAbsoluteTanH } from '../../utils/utils';
    import type { Node } from '../../utils/types';
    import NodeDetails from './NodeDetails.svelte';

    let modelUploaded: boolean = false;
    let detailsOpen: boolean = false;
    let selectedNode: Node = null;

    $: modelUploaded = $graph.nodes.length > 0 && $graph.links.length > 0;

    const POSITION_SCALE_FACTOR: number = 50

    const MARGIN = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    const NODE_FORMAT = {
        strokeWidth: 1.5,
        strokeOpacity: 1,
        radius: 15,
        scaledRadius: 19,
        squircleRadius: 8
    }

    const LINK_FORMAT = {
        strokeWidth: 2,
        strokeOpacity: .6,
        strokeLinecap: 'round'
    }

    let graph_div: HTMLDivElement;
    let tooltip;

    let width: number;
    let height: number;

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    let zoom: d3.ZoomBehavior<Element, unknown>;

    let weightScaledAbsoluteTanH: (x: number) => number = absoluteTanH;
    let biasScaledAbsoluteTanH: (x: number) => number = absoluteTanH;

    function redraw(nodes: any[], links: any[]): void {
        if (graph_div == null)
            return;

        weightScaledAbsoluteTanH = getScaledAbsoluteTanH(Math.max(...links.map(item => Math.abs(item.weight))));
        biasScaledAbsoluteTanH = getScaledAbsoluteTanH(Math.max(...nodes.map(item => Math.abs(item.bias))));

        // The tooltip element for link hovers
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'absolute bg-neutral-700/70 text-white dark:bg-secondarybackground-800/70 p-[5px] rounded')
            .style('display', 'none');

        // empty vis div
        d3.select(graph_div).html(null);  

        // determine width & height of parent element minus the margin
        width = d3.select(graph_div).node().getBoundingClientRect().width - MARGIN.left - MARGIN.right;
        height = d3.select(graph_div).node().getBoundingClientRect().height - MARGIN.top - MARGIN.bottom;

        zoom = d3.zoom()
            .on("zoom", function(event) {
                group.attr("transform", event.transform);
            })

        // create svg and group that is translated by the margin
        svg = d3.select(graph_div)
            .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("class", "max-w-full h-[intrinsic]")
                .call(zoom)

        svg.append("defs").append("marker")
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, 40, 40])
            .attr('refX', 14)
            .attr('refY', 10)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto-start-reverse')
        .append("path")
            .attr('d', 'M 0 0 L 20 10 L 0 20 L 0 16 L 13 10 L 0 4 z')
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("fill", "context-fill")

        var group = svg.append("g")

        // Links
        group.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
            .attr("class", (l) => l.hasDirection 
                ? "stroke-black fill-black" 
                : getLinkColor(l.weight))
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("stroke-opacity", LINK_FORMAT.strokeOpacity)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
            .attr('x1', (l) => l.source.x * POSITION_SCALE_FACTOR)
            .attr('y1', (l) => l.source.y * POSITION_SCALE_FACTOR)
            .attr('x2', (l) => l.isInput 
                ? (l.target.x * POSITION_SCALE_FACTOR) - NODE_FORMAT.radius - (2 * NODE_FORMAT.strokeWidth) 
                : (l.target.x * POSITION_SCALE_FACTOR))
            .attr('y2', (l) => l.target.y * POSITION_SCALE_FACTOR)
            .attr("marker-end", (l) => l.hasDirection ? "url(#arrow)" : null)

        // Hover areas on links (slightly larger than the links themselves)
        group.append("g")
            .selectAll(".linkHoverAreas")
            .data(links)
            .join("line")
            .attr("class", "stroke-transparent fill-transparent")
            .attr("stroke-width", LINK_FORMAT.strokeWidth * 3)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
            .attr('x1', (l) => l.source.x * POSITION_SCALE_FACTOR)
            .attr('y1', (l) => l.source.y * POSITION_SCALE_FACTOR)
            .attr('x2', (l) => l.isInput 
                ? (l.target.x * POSITION_SCALE_FACTOR) - NODE_FORMAT.radius - (2 * NODE_FORMAT.strokeWidth) 
                : (l.target.x * POSITION_SCALE_FACTOR))
            .attr('y2', (l) => l.target.y * POSITION_SCALE_FACTOR)
            .attr("marker-end", (l) => l.hasDirection ? "url(#arrow)" : null)
            .style("pointer-events", "all")  // Capture hover events
            .on("mouseover", (event, d) => {
                d3.select(event.target).attr("class", d.hasDirection 
                    ? "stroke-black fill-black" 
                    : getLinkColor(d.weight))
                tooltip.style('display', 'block')
                    .html(d.hasDirection ? (d.isInput ? "Input" : "Output") : `Weight: ${d.weight.toFixed(3)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on("mousemove", (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on("mouseout", (event) => {
                d3.select(event.target).attr("class", "stroke-transparent fill-transparent")
                tooltip.style('display', 'none');
            })

        // Main Nodes
        group.append("g")
                .attr("stroke-opacity", NODE_FORMAT.strokeOpacity)
                .attr("stroke-width", NODE_FORMAT.strokeWidth)
            .selectAll("circle")
            .data(nodes.filter((n) => !n.isInput))
                .join("circle")
                .attr("class", (n) => `stroke-black ${getNodeColor(n.bias)}`)
                .attr("r", NODE_FORMAT.radius)
                .attr("cx", (n) => n.x * POSITION_SCALE_FACTOR)
                .attr("cy", (n) => n.y * POSITION_SCALE_FACTOR)
                .on("mouseover", (event, _) => {
                    let nodeElement = d3.select(event.target);
                    nodeElement.attr("r", NODE_FORMAT.scaledRadius)
                    nodeElement.attr("style", "cursor: pointer;")
                })
                .on("mouseout", (event) => {
                    let nodeElement = d3.select(event.target);
                    nodeElement.attr("r", NODE_FORMAT.radius)
                    nodeElement.attr("style", "cursor: default;")
                })
                .on("click", (_, d) => {
                    selectedNode = d;
                    detailsOpen = true;
                })

        // Input Nodes
        group.append("g")
                .attr("stroke-opacity", NODE_FORMAT.strokeOpacity)
                .attr("stroke-width", NODE_FORMAT.strokeWidth)
            .selectAll("rect")
            .data(nodes.filter((n) => n.isInput))
                .join("rect")
                .attr("class", (n) => `stroke-black fill-secondarybackground-200 dark:fill-secondarybackground-800`)
                .attr("x", (n) => n.x * POSITION_SCALE_FACTOR - NODE_FORMAT.radius)
                .attr("y", (n) => n.y * POSITION_SCALE_FACTOR - NODE_FORMAT.radius)
                .attr("width", NODE_FORMAT.radius * 2)
                .attr("height", NODE_FORMAT.radius * 2)
                .attr("rx", NODE_FORMAT.squircleRadius)
                .on("mouseover", (event, d) => {
                    let nodeElement = d3.select(event.target);
                    nodeElement.attr("x", d.x * POSITION_SCALE_FACTOR - NODE_FORMAT.scaledRadius);
                    nodeElement.attr("y", d.y * POSITION_SCALE_FACTOR - NODE_FORMAT.scaledRadius);
                    nodeElement.attr("width", NODE_FORMAT.scaledRadius * 2);
                    nodeElement.attr("height", NODE_FORMAT.scaledRadius * 2);
                    nodeElement.attr("style", "cursor: pointer;")
                })
                .on("mouseout", (event, d) => {
                    let nodeElement = d3.select(event.target);
                    nodeElement.attr("x", d.x * POSITION_SCALE_FACTOR - NODE_FORMAT.radius);
                    nodeElement.attr("y", d.y * POSITION_SCALE_FACTOR - NODE_FORMAT.radius);
                    nodeElement.attr("width", NODE_FORMAT.radius * 2);
                    nodeElement.attr("height", NODE_FORMAT.radius * 2);
                    nodeElement.attr("style", "cursor: default;")
                })
                .on("click", (_, d) => {
                    selectedNode = d;
                    detailsOpen = true;
                })
    }

    const getLinkColor = (value: number) => {
        const enumeratedValues: string[] = ["stroke-linkcolorgradientlight-50 dark:stroke-linkcolorgradientdark-50 fill-linkcolorgradientlight-50 dark:fill-linkcolorgradientdark-50", 
                                            "stroke-linkcolorgradientlight-100 dark:stroke-linkcolorgradientdark-100 fill-linkcolorgradientlight-100 dark:fill-linkcolorgradientdark-100",
                                            "stroke-linkcolorgradientlight-200 dark:stroke-linkcolorgradientdark-200 fill-linkcolorgradientlight-200 dark:fill-linkcolorgradientdark-200",
                                            "stroke-linkcolorgradientlight-300 dark:stroke-linkcolorgradientdark-300 fill-linkcolorgradientlight-300 dark:fill-linkcolorgradientdark-300",
                                            "stroke-linkcolorgradientlight-400 dark:stroke-linkcolorgradientdark-400 fill-linkcolorgradientlight-400 dark:fill-linkcolorgradientdark-400",
                                            "stroke-linkcolorgradientlight-500 dark:stroke-linkcolorgradientdark-500 fill-linkcolorgradientlight-500 dark:fill-linkcolorgradientdark-500",
                                            "stroke-linkcolorgradientlight-600 dark:stroke-linkcolorgradientdark-600 fill-linkcolorgradientlight-600 dark:fill-linkcolorgradientdark-600", 
                                            "stroke-linkcolorgradientlight-700 dark:stroke-linkcolorgradientdark-700 fill-linkcolorgradientlight-700 dark:fill-linkcolorgradientdark-700", 
                                            "stroke-linkcolorgradientlight-800 dark:stroke-linkcolorgradientdark-800 fill-linkcolorgradientlight-800 dark:fill-linkcolorgradientdark-800", 
                                            "stroke-linkcolorgradientlight-900 dark:stroke-linkcolorgradientdark-900 fill-linkcolorgradientlight-900 dark:fill-linkcolorgradientdark-900"];

        return enumeratedValues[Math.round(weightScaledAbsoluteTanH(value) * (enumeratedValues.length - 1))];
    }

    const getNodeColor = (value: number) => {
        const enumeratedValues: string[] = ["fill-nodecolorgradientlight-50 dark:fill-nodecolorgradientdark-50", 
                                            "fill-nodecolorgradientlight-100 dark:fill-nodecolorgradientdark-100", 
                                            "fill-nodecolorgradientlight-200 dark:fill-nodecolorgradientdark-200", 
                                            "fill-nodecolorgradientlight-300 dark:fill-nodecolorgradientdark-300", 
                                            "fill-nodecolorgradientlight-400 dark:fill-nodecolorgradientdark-400", 
                                            "fill-nodecolorgradientlight-500 dark:fill-nodecolorgradientdark-500", 
                                            "fill-nodecolorgradientlight-600 dark:fill-nodecolorgradientdark-600", 
                                            "fill-nodecolorgradientlight-700 dark:fill-nodecolorgradientdark-700", 
                                            "fill-nodecolorgradientlight-800 dark:fill-nodecolorgradientdark-800", 
                                            "fill-nodecolorgradientlight-900 dark:fill-nodecolorgradientdark-900"];

        return enumeratedValues[Math.round(biasScaledAbsoluteTanH(value) * (enumeratedValues.length - 1))];
    }

    const panCenter = () => {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }

    const zoomIn = () => {
        svg.transition().call(zoom.scaleBy, 1.2);
    }

    const zoomOut = () => {
        svg.transition().call(zoom.scaleBy, .8);
    }

    afterUpdate(() => {
        redraw($graph.nodes, $graph.links);
        window.addEventListener('resize', () => redraw($graph.nodes, $graph.links));
    })

    $: redraw($graph.nodes, $graph.links);
</script>

<!--
@component
This component will render the provided nodes and 
links as a pannable and zoomable graph.

*nodes* - The nodes to render.

*links* - The links to render.

## Usage:
    ```tsx
        <Graph nodes={nodeList} links={linkList} />
    ```
-->

{#if $uploading}
    <div id='spinner' out:fade class="absolute">
        <Spinner size='14' />   
    </div>
{:else if modelUploaded}
    <div id="graph" bind:this={graph_div} in:fade 
        class="w-full h-full flex justify-center items-center absolute"
    />
{:else}
    <div id='upload_text' out:fade>
        <p class="text-xl">Please upload a model to continue...</p> 
    </div>
{/if}

<div id="pan-center" class="absolute bottom-40 right-8">
    <Button pill class="!p-2" size="xl" on:click={panCenter} disabled={!modelUploaded}>
        <MapPin />
    </Button>
</div>

<div id="zoom-in" class="absolute bottom-24 right-8">
    <Button pill class="!p-2" size="xl" on:click={zoomIn} disabled={!modelUploaded}>
        <MagnifyingGlassPlus />
    </Button>
</div>

<div id="zoom-out" class="absolute bottom-8 right-8">
    <Button pill class="!p-2" size="xl" on:click={zoomOut} disabled={!modelUploaded}>
        <MagnifyingGlassMinus />
    </Button>
</div>

<NodeDetails bind:open={detailsOpen} bind:node={selectedNode} />