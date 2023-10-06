<script lang="ts">
    import Toast from "./Toast.svelte";
    import { breads } from '../../utils/stores';
</script>

<div id="toaster">
    {#each $breads as bread (bread.id)}
        <Toast
            id={bread.id}
            type={bread.type}
            message={bread.message}
            duration={bread.duration}
            on:close={() => {
                $breads = $breads.filter((filterableBread) => filterableBread.id !== bread.id);
            }}
        />
    {/each}
</div>

<style>
    #toaster {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1000;
        height: auto;
        width: 350px;
        max-height: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>