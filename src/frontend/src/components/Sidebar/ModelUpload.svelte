<script lang="ts">
    import { Button, Fileupload, Label, Helper } from 'flowbite-svelte';
    import { CheckCircle, XCircle } from 'svelte-heros-v2';
    import api from '../../utils/api';
    import { graph, uploading } from '../../utils/stores';
    import { sendToast, getResponseError } from '../../utils/utils';
    
    let files: FileList;
``
    let modelValid: boolean = false;
    let validationClass: string;

    $: validationClass = modelValid ? "text-success" : "text-error";

    let submitForm = () => {
        $uploading = true;
        api.post('/graph', files)
            .then((res: any) => {
                $graph = { nodes: res.data.graph.nodes, links: res.data.graph.links }
                modelValid = true;
                $uploading = false;
            })
            .catch((err: any) => {
                let [_, message] = getResponseError(err);
                sendToast("error", `${message}`);
                modelValid = false;
                $uploading = false;
            })
    }

</script>

<Label for="model_upload" class="mb-2">Select Model:</Label>
<Fileupload id="model-upload" bind:files />
<Helper>PTH</Helper>
<div class="flex flex-row mt-4">
    <Button on:click={submitForm}>Upload</Button>
    <div id="model-validation" class="{validationClass} m-auto">
        {#if modelValid}
        <CheckCircle style="margin-right: 5px;"/>
        {:else}
        <XCircle style="margin-right: 5px;"/>
        {/if}
        Model is {modelValid ? "" : "not "}valid
    </div>
</div>

<style>
    #model-validation {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        min-width: 190px;
    }
</style>