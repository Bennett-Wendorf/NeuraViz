<script lang="ts">
    import api from './utils/api'
    import {onMount} from 'svelte'
    import Graph from './components/Graph.svelte'
    import Sidebar from './components/Sidebar.svelte'
    
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
    <Sidebar />
    <div id="graph_container">
        <Graph nodes={nodes} links={links} />
    </div>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
		display: flex;
        justify-content: center;
        align-items: center;
    }

    #graph_container {
        width: 80vw;
        height: 100vh;
        flex-grow: 1;
        flex-shrink: 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>