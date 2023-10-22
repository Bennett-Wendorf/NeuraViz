<script lang="ts">
    import { Modal } from "flowbite-svelte";
    import type { Node } from "../../utils/types";

    export let open: boolean = false;
    export let node: Node = null;
</script>

<Modal title="Node Details" bind:open autoclose outsideclose
    backdropClass="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50 dark:bg-opacity-80"
    defaultClass="">
    <!-- TODO: Add node data -->
    <svelte:fragment slot="footer">
        <button class="btn btn-primary" on:click={() => open = false}>Close</button>
    </svelte:fragment>
</Modal>