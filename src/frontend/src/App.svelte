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
    <Graph nodes={nodes} links={links} />
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