<script lang="ts">
    import Toast from "./Toast.svelte";
    import { breads } from '../../utils/stores';
</script>

<div id="toaster" class="absolute top-0 right-0 z-50 h-auto w-[350px] max-h-screen overflow-hidden pb-4">
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