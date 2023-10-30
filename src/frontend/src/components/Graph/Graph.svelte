<script lang="ts">
    import * as d3 from 'd3';
    import { Button, Spinner } from 'flowbite-svelte';
    import { afterUpdate, onMount } from 'svelte';
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

    const POSITION_SCALE_FACTOR: number = 50;

    const MARGIN = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
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
        strokeOpacity: 0.6,
        strokeLinecap: "round",
    };

    const ACTIVATION_FORMAT = {
        strokeWidth: 2,
        strokeOpacity: 0.6,
        overhang: 10,
    };

    let graph_div: HTMLDivElement;
    let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, undefined>;

    let width: number;
    let height: number;

    let data_max_y: number;
    let data_min_y: number;

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    let zoom: d3.ZoomBehavior<Element, unknown>;

    let weightScaledAbsoluteTanH: (x: number) => number = absoluteTanH;
    let biasScaledAbsoluteTanH: (x: number) => number = absoluteTanH;

    function redraw(nodes: any[], links: any[]): void {
        if (graph_div == null) return;

        weightScaledAbsoluteTanH = getScaledAbsoluteTanH(
            Math.max(...links.map((item) => Math.abs(item.weight)))
        );
        biasScaledAbsoluteTanH = getScaledAbsoluteTanH(
            Math.max(...nodes.map((item) => Math.abs(item.bias)))
        );
  
        // empty vis div
        d3.select(graph_div).html(null);

        // determine width & height of parent element minus the margin
        width =
            d3.select(graph_div).node().getBoundingClientRect().width -
            MARGIN.left -
            MARGIN.right;
        height =
            d3.select(graph_div).node().getBoundingClientRect().height -
            MARGIN.top -
            MARGIN.bottom;

        data_max_y = d3.max(nodes, (d) => d.y);
        data_min_y = d3.min(nodes, (d) => d.y);

        zoom = d3.zoom().on("zoom", function (event) {
            group.attr("transform", event.transform);
        });

        // create svg and group that is translated by the margin
        svg = d3
            .select(graph_div)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("class", "max-w-full h-[intrinsic]")
            .call(zoom);

        let defs = svg.append("defs");

        defs.append("marker")
            .attr("id", "arrow")
            .attr("viewBox", [0, 0, 40, 40])
            .attr("refX", 14)
            .attr("refY", 10)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 20 10 L 0 20 L 0 16 L 13 10 L 0 4 z")
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("fill", "context-fill");

        let primaryGradient = defs
            .append("linearGradient")
            .attr("id", "primarygradient")
            .attr("x1", 1.5)
            .attr("y1", 7)
            .attr("x2", 15)
            .attr("y2", 7)
            .attr("gradientUnits", "userSpaceOnUse");

        primaryGradient
            .append("stop")
            .attr("style", "stop-color: #a5f3fc; stop-opacity: 1")
            .attr("offset", 0);

        primaryGradient
            .append("stop")
            .attr("style", "stop-color: #06b6d4; stop-opacity: 1")
            .attr("offset", 1);

        let relu = defs
            .append("marker")
            .attr("id", "ReLU")
            .attr("viewBox", [0, 0, 40, 40])
            .attr("refX", 8.5)
            .attr("refY", 16)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40);
        relu.append("rect")
            .attr("class", "fill-neutral-600 stroke-[0.58]")
            .attr("width", 17)
            .attr("height", 17)
            .attr("x", 0)
            .attr("y", 0)
            .attr("ry", 2.64);
        relu.append("path")
            .attr("class", "fill-none stroke-[url(#primarygradient)] stroke-[1.2]")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("d", "M 1.7197917,11.90625 H 8.5 L 14.948958,3.9687503");

        var group = svg.append("g");

        // Links
        group
            .append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("class", (l) =>
                l.hasDirection
                    ? "stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-400 dark:fill-neutral-400"
                    : getLinkColor(l.weight)
            )
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("stroke-opacity", LINK_FORMAT.strokeOpacity)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
            .attr("x1", (l) => l.source.x * POSITION_SCALE_FACTOR)
            .attr("y1", (l) => l.source.y * POSITION_SCALE_FACTOR)
            .attr("x2", (l) =>
                l.isInput
                    ? l.target.x * POSITION_SCALE_FACTOR -
                      NODE_FORMAT.radius -
                      2 * NODE_FORMAT.strokeWidth
                    : l.target.x * POSITION_SCALE_FACTOR
            )
            .attr("y2", (l) => l.target.y * POSITION_SCALE_FACTOR)
            .attr("marker-end", (l) => (l.hasDirection ? "url(#arrow)" : null));

        // Hover areas on links (slightly larger than the links themselves)
        group
            .append("g")
            .selectAll(".linkHoverAreas")
            .data(links)
            .join("line")
            .attr("class", "stroke-transparent fill-transparent")
            .attr("stroke-width", LINK_FORMAT.strokeWidth * 3)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
            .attr("x1", (l) => l.source.x * POSITION_SCALE_FACTOR)
            .attr("y1", (l) => l.source.y * POSITION_SCALE_FACTOR)
            .attr("x2", (l) =>
                l.isInput
                    ? l.target.x * POSITION_SCALE_FACTOR -
                      NODE_FORMAT.radius -
                      2 * NODE_FORMAT.strokeWidth
                    : l.target.x * POSITION_SCALE_FACTOR
            )
            .attr("y2", (l) => l.target.y * POSITION_SCALE_FACTOR)
            .attr("marker-end", (l) => (l.hasDirection ? "url(#arrow)" : null))
            .style("pointer-events", "all") // Capture hover events
            .on("mouseover", (event, d) => {
                d3.select(event.target).attr("class", d.hasDirection 
                    ? "stroke-neutral-800 fill-neutral-800 dark:stroke-neutral-400 dark:fill-neutral-400" 
                    : getLinkColor(d.weight))
                tooltip.style('display', 'block')
                    .html(d.hasDirection ? (d.isInput ? "Input" : "Output") : `Weight: ${d.weight.toFixed(3)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.target).attr(
                    "class",
                    "stroke-transparent fill-transparent"
                );
                tooltip.style("display", "none");
            });

        // Main Nodes
        group
            .append("g")
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
        group
            .append("g")
            .attr("stroke-opacity", NODE_FORMAT.strokeOpacity)
            .attr("stroke-width", NODE_FORMAT.strokeWidth)
            .selectAll("rect")
            .data(nodes.filter((n) => n.isInput))
                .join("rect")
                .attr("class", (n) => `stroke-black fill-neutral-400 dark:fill-neutral-600`)
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
  
        // Activation function
        group
            .append("g")
            .selectAll("line")
            .data([{ function: "ReLU", x: 0.5 }])
            .join("line")
            .attr("class", "stroke-neutral-800 dark:stroke-neutral-400")
            .attr("stroke-opacity", ACTIVATION_FORMAT.strokeOpacity)
            .attr("stroke-width", ACTIVATION_FORMAT.strokeWidth)
            .attr("stroke-dasharray", "10, 10")
            .attr("x1", (d) => d.x * POSITION_SCALE_FACTOR)
            .attr(
                "y1",
                data_max_y * POSITION_SCALE_FACTOR +
                    NODE_FORMAT.radius +
                    ACTIVATION_FORMAT.overhang
            )
            .attr("x2", (d) => d.x * POSITION_SCALE_FACTOR)
            .attr(
                "y2",
                data_min_y * POSITION_SCALE_FACTOR -
                    NODE_FORMAT.radius -
                    ACTIVATION_FORMAT.overhang
            )
            .attr("marker-end", "url(#ReLU)")
    }

    const getLinkColor = (value: number) => {
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
                weightScaledAbsoluteTanH(value) * (enumeratedValues.length - 1)
            )
        ];
    };

    const getNodeColor = (value: number) => {
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
                biasScaledAbsoluteTanH(value) * (enumeratedValues.length - 1)
            )
        ];
    };

    const panCenter = () => {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    };

    const zoomIn = () => {
        svg.transition().call(zoom.scaleBy, 1.2);
    };

    const zoomOut = () => {
        svg.transition().call(zoom.scaleBy, 0.8);
    };

    onMount(() => {
        tooltip = d3.select('#weightTooltip');
        // console.log(`Nodes: ${$graph.nodes.length}, Links: ${$graph.links.length}`)
        redraw($graph.nodes, $graph.links);
        window.addEventListener("resize", () =>
            redraw($graph.nodes, $graph.links)
        );
    });

    // This timeout is used to help ensure that the graph container is rendered before trying to draw inside it.
    $: setTimeout(() => redraw($graph.nodes, $graph.links), 10);
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
    <div id="spinner" out:fade class="absolute">
        <Spinner size="14" />
    </div>
{:else if modelUploaded}
    <div
        id="graph"
        bind:this={graph_div}
        in:fade
        class="w-full h-full flex justify-center items-center absolute"
    />
{:else}
    <div id="upload_text" out:fade>
        <p class="text-xl text-neutral-800 dark:text-neutral-400">
            Please upload a model to continue...
        </p>
    </div>
{/if}

<div id="pan-center" class="absolute bottom-40 right-8">
    <Button
        pill
        class="!p-2"
        size="xl"
        on:click={panCenter}
        disabled={!modelUploaded}
    >
        <MapPin />
    </Button>
</div>

<div id="zoom-in" class="absolute bottom-24 right-8">
    <Button
        pill
        class="!p-2"
        size="xl"
        on:click={zoomIn}
        disabled={!modelUploaded}
    >
        <MagnifyingGlassPlus />
    </Button>
</div>

<div id="zoom-out" class="absolute bottom-8 right-8">
    <Button
        pill
        class="!p-2"
        size="xl"
        on:click={zoomOut}
        disabled={!modelUploaded}
    >
        <MagnifyingGlassMinus />
    </Button>
</div>

<div id="weightTooltip" class="z-50 fixed bg-neutral-700/70 text-white dark:bg-secondarybackground-800/70 p-[5px] rounded" style="display: none;" />

<NodeDetails bind:open={detailsOpen} bind:node={selectedNode} />
