<script lang="ts">
    import api from './utils/api'
    import {onMount} from 'svelte'
    import Graph from './components/Graph.svelte'
    import { Spinner } from 'flowbite-svelte'
    
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
        <Spinner size={"14"}/>
    {/if}
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
		display: flex;
        justify-content: center;
        align-items: center;
    }
</style>