<script lang="ts">
    import api from './utils/api'
    import * as d3 from 'd3'
    import {onMount} from 'svelte'
    
    let rand = -1
    let vis: HTMLDivElement

    let getRand = () => {
        api.get('/rand')
            .then(res => res.data)
            .then(data => rand = data)
    }

    let data = [];
    for (let i = 0; i < 100; ++i) {
        data.push({x: Math.random() * 10, y: Math.random() * 10})
    }

    let xScale = d3.scaleLinear().domain([0, 10]);
    let yScale = d3.scaleLinear().domain([0, 10]);
    let width: number;
    let height: number;
    const margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 30
    };

    function redraw(): void {
        // empty vis div
        d3.select(vis).html(null);  // determine width & height of parent element minus the margin

        width = d3.select(vis).node().getBoundingClientRect().width - margin.left - margin.right;
        height = d3.select(vis).node().getBoundingClientRect().height - margin.top - margin.bottom;  // init scales according to new width & height
        
        xScale.range([0, width]);
        yScale.range([height, 0]);  // create svg and group that is translated by the margin
        
        const svg = d3.select(vis)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${[margin.left, margin.top]})`)  // draw x and y axes
        svg.append("g")
            .attr("transform", `translate(${[0, height]})`)
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .call(d3.axisLeft(yScale));  // draw data points
        svg.append('g').selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { 
                return xScale(d.x); 
            })
            .attr('cy', function (d) { 
                return yScale(d.y); 
            })
            .attr('r', 7)
            .style('fill', '#ff3e00')
            .style('fill-opacity', '0.5')
            .style('stroke', '#ff3e00');
    }

    onMount(() => {
        redraw();
        window.addEventListener('resize', redraw);
    })
</script>

<main>
    <h1>Hello World!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
    <br />

    <button on:click={getRand}>Get random number</button>
    {#if rand != -1}
        <p>Random number: {rand}</p>
    {/if}
    <br />

    <div id='vis' bind:this={vis} />
</main>

<style>
    main {
        height: 100%;
		display: flex;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
	
	#vis {
		width: 100%;
		height: 100%;
		background-color: whitesmoke;
	}
</style>