<script lang="ts">
    import api from './utils/api'
    import {onMount} from 'svelte'
    import Graph from './components/Graph.svelte'
    
    let nodes: any[]
    let links: any[]

    function getGraph() {
        api.get('/graph')
            .then((res: any) => {
                nodes = res.data.nodes
                links = res.data.links
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    onMount(() => {
        getGraph()
    })
</script>

<main>
    {#if nodes && links}
        <Graph nodes={nodes} links={links} />
    {:else}
        <h1>Loading...</h1>
    {/if}
</main>

<style>
    main {
        height: 100%;
		display: flex;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>