<script lang="ts">
    import * as d3 from 'd3';
    import { Button, Spinner } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { MagnifyingGlassPlus, MagnifyingGlassMinus, MapPin } from 'svelte-heros-v2'
    import { fade } from 'svelte/transition';
    import { graph, uploading } from '../../utils/stores';
    import { absoluteTanH, getScaledAbsoluteTanH } from '../../utils/utils';
    import type { Node, NodeCollection, Link, LinkCollection, Activation } from '../../utils/types';
    import { isLinkCollection, isNodeCollection } from '../../utils/types';
    import NodeDetails from './NodeDetails.svelte';
    import { getArrowhead, getMultiMarker } from './graph_components/defs/marker';
    import { getPrimaryLightGradient, getPrimaryDarkGradient } from './graph_components/defs/gradient';
    import { getActivation } from './graph_components/activations/activationOverlayBuilder';
    import { getLinkHoverAreas, getVisibleLinks } from './graph_components/links';
    import { getInputNodes, getMainNodes } from './graph_components/nodes';

    let modelUploaded: boolean = false;
    let detailsOpen: boolean = false;
    let selectedNode: Node = null;

    $: modelUploaded = $graph.nodes.length > 0 && $graph.links.length > 0;

    const POSITION_SCALE_FACTOR: number = 50;
    const ACTIVATION_ICON_SCALE_FACTOR: number = 1.5; // Relative to node radius

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
        squircleRadius: 8,
        layerNodeOffset: 5
    }

    const LINK_FORMAT = {
        strokeWidth: 2,
        strokeOpacity: 0.6,
        strokeLinecap: "round",
        hoverScaleFactor: 3,
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

    let dataMaxY: number;
    let dataMinY: number;

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    let zoom: d3.ZoomBehavior<Element, unknown>;

    let weightScaledAbsoluteTanH: (x: number) => number = absoluteTanH;
    let biasScaledAbsoluteTanH: (x: number) => number = absoluteTanH;

    function redraw(nodes: (Node | NodeCollection)[], links: (Link | LinkCollection)[], activations: Activation[]): void {
        if (graph_div == null) return;

        weightScaledAbsoluteTanH = getScaledAbsoluteTanH(
            Math.max(...links.map((item) => Math.abs(isLinkCollection(item) ? 0 : item.weight)))
        );
        biasScaledAbsoluteTanH = getScaledAbsoluteTanH(
            Math.max(...nodes.map((item) => Math.abs(isNodeCollection(item) ? 0 : item.bias)))
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

        dataMaxY = d3.max(nodes, (d) => isNodeCollection(d) ? 0 : d.y);
        dataMinY = d3.min(nodes, (d) => isNodeCollection(d) ? 0 : d.y);

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
            .attr("class", "max-w-full h-[intrinsic] cursor-move")
            .call(zoom);

        let defs = svg.append("defs");

        let arrowName = "arrow"
        defs.append(() => getArrowhead(arrowName, LINK_FORMAT.strokeWidth, LINK_FORMAT.strokeOpacity));

        let arrowHoverName = "arrowHover"
        defs.append(() => getArrowhead(arrowHoverName, LINK_FORMAT.strokeWidth, 1));

        let multiMarkerName = "multiMarker"
        defs.append(() => getMultiMarker(multiMarkerName, LINK_FORMAT.strokeWidth / 2, LINK_FORMAT.strokeLinecap, 
            LINK_FORMAT.strokeOpacity, 18, 10));

        let multiMarkerHoverName = "multiMarkerHover"
        defs.append(() => getMultiMarker(multiMarkerHoverName, LINK_FORMAT.strokeWidth / 2, LINK_FORMAT.strokeLinecap, 
            1, 9.3, 10));

        defs.append(() => getPrimaryLightGradient("primarylightgradient"));
        defs.append(() => getPrimaryDarkGradient("primarydarkgradient"));

        var group = svg.append("g");

        // Links
        group.append(() => getVisibleLinks(links ?? [], LINK_FORMAT.strokeWidth, LINK_FORMAT.strokeOpacity, 
            LINK_FORMAT.strokeLinecap, POSITION_SCALE_FACTOR, NODE_FORMAT.radius, NODE_FORMAT.strokeWidth, 
            arrowName, multiMarkerName, weightScaledAbsoluteTanH));

        // Hover areas on links (slightly larger than the links themselves)
        group.append(() => getLinkHoverAreas(links ?? [], LINK_FORMAT.strokeWidth, LINK_FORMAT.strokeLinecap, 
            POSITION_SCALE_FACTOR, NODE_FORMAT.radius, NODE_FORMAT.strokeWidth, arrowHoverName, multiMarkerHoverName,
            weightScaledAbsoluteTanH, LINK_FORMAT.hoverScaleFactor, tooltip));

        // Main Nodes
        group.append(() => getMainNodes(nodes ?? [], NODE_FORMAT.layerNodeOffset, NODE_FORMAT.strokeWidth,
            NODE_FORMAT.strokeOpacity, NODE_FORMAT.radius, POSITION_SCALE_FACTOR,
            NODE_FORMAT.scaledRadius, biasScaledAbsoluteTanH, (_, data: Node) => {
                selectedNode = data;
                detailsOpen = true;
            }))

        // Input Nodes
        group.append(() => getInputNodes(nodes ?? [], NODE_FORMAT.layerNodeOffset, NODE_FORMAT.squircleRadius,
            NODE_FORMAT.radius, NODE_FORMAT.scaledRadius, POSITION_SCALE_FACTOR,
            (_, data: Node) => {
                selectedNode = data;
                detailsOpen = true;
            }))

        // Activation functions
        group.append("g")
            .selectAll("g")
            .data(activations ?? [])
            .join("g")
                .append((data) => getActivation(data, POSITION_SCALE_FACTOR,
                    NODE_FORMAT.radius, ACTIVATION_FORMAT.strokeOpacity,
                    ACTIVATION_FORMAT.strokeWidth, dataMinY, dataMaxY,
                     ACTIVATION_FORMAT.overhang, ACTIVATION_ICON_SCALE_FACTOR, 
                     tooltip))
    }

    function panCenter() {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    };

    function zoomIn() {
        svg.transition().call(zoom.scaleBy, 1.2);
    };

    function zoomOut() {
        svg.transition().call(zoom.scaleBy, 0.8);
    };

    onMount(() => {
        tooltip = d3.select('#weightTooltip');
        redraw($graph.nodes, $graph.links, $graph.activations);
        window.addEventListener("resize", () =>
            redraw($graph.nodes, $graph.links, $graph.activations)
        );
    });

    // This timeout is used to help ensure that the graph container is rendered before trying to draw inside it.
    $: setTimeout(() => redraw($graph.nodes, $graph.links, $graph.activations), 10);
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
