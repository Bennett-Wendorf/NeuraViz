<script lang="ts">
    import Toaster from './components/Toaster/Toaster.svelte';
    import Graph from './components/Graph/Graph.svelte'
    import Sidebar from './components/Sidebar/Sidebar.svelte'
</script>

<main 
    class="bg-background-200 dark:bg-background-800 h-screen w-screen
        flex justify-center items-center"
>
    <Sidebar />
    <Toaster/>
    <div id="graph_container" 
        class="h-screen w-[80vw] flex grow
        shrink relative justify-center items-center"
    >
        <Graph />
    </div>
</main>