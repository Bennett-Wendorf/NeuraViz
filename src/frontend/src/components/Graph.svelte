<script lang="ts">
    import * as d3 from 'd3';
    import { afterUpdate } from 'svelte';

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

    function redraw(): void {

        console.log('redrawing...')
        console.log(nodes)
        console.log(links)

        // empty vis div
        d3.select(vis).html(null);  
        
        // determine width & height of parent element minus the margin
        width = d3.select(vis).node().getBoundingClientRect().width - MARGIN.left - MARGIN.right;
        height = d3.select(vis).node().getBoundingClientRect().height - MARGIN.top - MARGIN.bottom;  
        
        // create svg and group that is translated by the margin
        const svg = d3.select(vis)
            .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        // Links
        svg.append("g")
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
        svg.append("g")
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

    afterUpdate(() => {
        redraw();
        window.addEventListener('resize', redraw);
    })
</script>

<div id="vis" class="graph" bind:this={vis} />

<style>
    .graph {
        width: 100%;
        height: 100%;
    }

    #vis {
		width: 100%;
		height: 100%;
		background-color: whitesmoke;
	}
</style>