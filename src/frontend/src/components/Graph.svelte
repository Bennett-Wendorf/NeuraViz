<script lang="ts">
    import * as d3 from 'd3';
    import { Button, Spinner } from 'flowbite-svelte';
    import { afterUpdate } from 'svelte';
    import { MagnifyingGlassPlus, MagnifyingGlassMinus, MapPin } from 'svelte-heros-v2'
    import { fade } from 'svelte/transition';
    import { graph, uploading } from '../utils/stores';

    let modelUploaded: boolean = false;

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
        radius: 15
    }

    const LINK_FORMAT = {
        strokeWidth: 2,
        strokeOpacity: .6,
        strokeLinecap: 'round'
    }

    let graph_div: HTMLDivElement;

    let width: number;
    let height: number;

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    let zoom: d3.ZoomBehavior<Element, unknown>;

    function redraw(nodes: any[], links: any[]): void {
        if (graph_div == null)
            return;

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

        var group = svg.append("g")

        // Links
        group.append("g")
            .attr("class", "stroke-neutral-500 dark:stroke-neutral-400")
            .attr("stroke-opacity", LINK_FORMAT.strokeOpacity)
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
        .selectAll("line")
        .data(links)
            .join("line")
            .attr('x1', (l) => l.source.x * POSITION_SCALE_FACTOR)
            .attr('y1', (l) => l.source.y * POSITION_SCALE_FACTOR)
            .attr('x2', (l) => l.target.x * POSITION_SCALE_FACTOR)
            .attr('y2', (l) => l.target.y * POSITION_SCALE_FACTOR)

        // Nodes
        group.append("g")
                .attr("class", "stroke-black fill-secondarybackground-200")
                .attr("stroke-opacity", NODE_FORMAT.strokeOpacity)
                .attr("stroke-width", NODE_FORMAT.strokeWidth)
            .selectAll("circle")
            .data(nodes)
                .join("circle")
                .attr("r", NODE_FORMAT.radius)
                .attr("cx", (n) => n.x * POSITION_SCALE_FACTOR)
                .attr("cy", (n) => n.y * POSITION_SCALE_FACTOR)
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