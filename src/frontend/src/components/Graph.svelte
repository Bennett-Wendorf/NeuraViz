<script lang="ts">
    import * as d3 from 'd3';
    import { Button } from 'flowbite-svelte';
    import { afterUpdate } from 'svelte';
    import { MagnifyingGlassPlus, MagnifyingGlassMinus, MapPin } from 'svelte-heros-v2'

    export let nodes: any[]
    export let links: any[]

    const POSITION_SCALE_FACTOR: number = 50

    const MARGIN = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    const NODE_FORMAT = {
        stroke: '#000',
        fill: '#fff',
        strokeWidth: 1.5,
        strokeOpacity: 1,
        radius: 15
    }

    const LINK_FORMAT = {
        stroke: '#999',
        strokeWidth: 2,
        strokeOpacity: .6,
        strokeLinecap: 'round'
    }

    let vis: HTMLDivElement;

    let width: number;
    let height: number;

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    let zoom: d3.ZoomBehavior<Element, unknown>;

    function redraw(): void {
        // empty vis div
        d3.select(vis).html(null);  

        // determine width & height of parent element minus the margin
        width = d3.select(vis).node().getBoundingClientRect().width - MARGIN.left - MARGIN.right;
        height = d3.select(vis).node().getBoundingClientRect().height - MARGIN.top - MARGIN.bottom;

        zoom = d3.zoom()
            .on("zoom", function(event) {
                group.attr("transform", event.transform);
            })

        // create svg and group that is translated by the margin
        svg = d3.select(vis)
            .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                .call(zoom)

        var group = svg.append("g")

        // Links
        group.append("g")
            .attr("stroke", LINK_FORMAT.stroke)
            .attr("stroke-opacity", LINK_FORMAT.strokeOpacity)
            .attr("stroke-width", LINK_FORMAT.strokeWidth)
            .attr("stroke-linecap", LINK_FORMAT.strokeLinecap)
        .selectAll("line")
        .data(links)
            .join("line")
            .attr('x1', (l) => nodes[l.source].x * POSITION_SCALE_FACTOR)
            .attr('y1', (l) => nodes[l.source].y * POSITION_SCALE_FACTOR)
            .attr('x2', (l) => nodes[l.target].x * POSITION_SCALE_FACTOR)
            .attr('y2', (l) => nodes[l.target].y * POSITION_SCALE_FACTOR)

        // Nodes
        group.append("g")
                .attr("fill", NODE_FORMAT.fill)
                .attr("stroke", NODE_FORMAT.stroke)
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
        redraw();
        window.addEventListener('resize', redraw);
    })
</script>

<div id="vis" class="graph" bind:this={vis} />

<div id="pan-center">
    <Button pill class="!p-2" size="xl" on:click={panCenter}>
        <MapPin />
    </Button>
</div>

<div id="zoom-in">
    <Button pill class="!p-2" size="xl" on:click={zoomIn}>
        <MagnifyingGlassPlus />
    </Button>
</div>

<div id="zoom-out">
    <Button pill class="!p-2" size="xl" on:click={zoomOut}>
        <MagnifyingGlassMinus />
    </Button>
</div>

<style>
    .graph {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #pan-center {
        position: absolute;
        bottom: 10rem;
        right: 2rem;
    }

    #zoom-in {
        position: absolute;
        bottom: 6em;
        right: 2rem;
    }

    #zoom-out {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
    }
</style>