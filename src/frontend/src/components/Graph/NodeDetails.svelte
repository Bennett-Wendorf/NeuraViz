<script lang="ts">
    import { Modal, Button } from "flowbite-svelte";
    import type { Node, NodeCollection } from "../../utils/types";
    import { isNodeCollection } from "../../utils/types";

    export let open: boolean = false;
    export let node: Node | NodeCollection = null;
</script>

<Modal bind:open autoclose outsideclose color="none"
    backdropClass="fixed inset-0 z-50 bg-neutral-900 bg-opacity-50 dark:bg-opacity-80"
    class="w-full bg-secondarybackground-200 text-neutral-800 dark:bg-secondarybackground-800 dark:text-neutral-400">
    <h1 class="mb-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-400">Node Details</h1>
    {#if node.isInput}
        <h3 class="text-md text-neutral-800 dark:text-neutral-400">
            {isNodeCollection(node) ? `This is an input layer containing ${node.numNodes} nodes.` : "This is an input node."}
        </h3>
    {:else}
        <h3 class="text-md text-neutral-800 dark:text-neutral-400">
            {#if isNodeCollection(node)}
                This is a layer containing {node.numNodes} nodes.
            {:else}
                <span class="font-semibold">Bias:</span> {node.bias?.toFixed(3)}
            {/if}
        </h3>
    {/if}
    <Button color="none" on:click={() => open = false}
        class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-2.5 
            text-sm text-white bg-neutral-600 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-600 focus:ring-neutral-300 
            dark:focus:ring-neutral-700 rounded-lg"
        aria-label="Close"
    >
        Close
    </Button>
</Modal>