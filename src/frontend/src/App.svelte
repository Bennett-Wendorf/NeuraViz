<script lang="ts">
    import Graph from './components/Graph.svelte'
    import Sidebar from './components/Sidebar/Sidebar.svelte'

</script>

<main>
    <Sidebar />
    <div id="graph_container">
        <Graph />
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