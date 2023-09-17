<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { CheckCircle, XCircle } from 'svelte-heros-v2';

    let modelValid: boolean = true;
    let validationClass: string;

    $: validationClass = modelValid ? "text-success" : "text-error";
</script>

<div id="sidebar" color="secondary-background">
    <div class='sidebar-row'>
        <Button color="primary" on:click={() => modelValid = !modelValid}>Select Model</Button>
        <div id="model-validation" class="{validationClass}">
            {#if modelValid}
                <CheckCircle style="margin-right: 5px;"/>
            {:else}
                <XCircle style="margin-right: 5px;"/>
            {/if}
            Model is {modelValid ? "" : "not "}valid
        </div>
    </div>
    <div>
        <p id="settings-label" class="leading-relaxed font-semibold text-3xl text-center dark:text-gray-400">
            Settings
        </p>
        <hr class="sidebar-divider"/>
    </div>
</div>

<style lang="postcss">
    #sidebar {
        height: 100vh;
        width: 400px;
        border-right: 1px solid #000;
        background-color: theme(colors.secondary_background);
        z-index: 1000;
        padding: 1rem;
    }

    .sidebar-row {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    #model-validation {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        min-width: 190px;
    }

    #settings-label {
        margin-top: 1rem;
        margin-bottom: .25rem;
    }

    .sidebar-divider {
        width: 95%;
    }
</style>