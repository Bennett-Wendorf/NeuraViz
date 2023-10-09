<script lang="ts">
    import { Button, Label, Helper, Tooltip } from 'flowbite-svelte';
    import { CheckCircle, XCircle, XMark } from 'svelte-heros-v2';
    import api from '../../utils/api';
    import { modelValid, graphFile, graph, uploading } from '../../utils/stores';
    import { sendToast, getResponseError } from '../../utils/utils';

    let fileUploader;
    let files: FileList;
    let validationClass: string;
    let uploadButtonDisabled: boolean = false;

    $: validationClass = $modelValid ? "text-success" : "text-error";

    $: $graphFile = files ? files[0]?.name ?? '' : $graphFile;

    $: uploadButtonDisabled = $uploading || $modelValid;

    let clearModel = () => {
        $graph = { nodes: [], links: [] }
        $modelValid = false;
        $graphFile = null;
        files = null;
    }

    let handleFileUploadChange = () => {
        $modelValid = false;
    }

    let submitForm = () => {
        $uploading = true;
        api.post('/graph', files)
            .then((res: any) => {
                $graph = { nodes: res.data.graph.nodes, links: res.data.graph.links }
                $modelValid = true;
                $uploading = false;
                sendToast("success", "Model uploaded successfully");
            })
            .catch((err: any) => {
                let [_, message] = getResponseError(err);
                sendToast("error", `${message}`);
                $uploading = false;
                clearModel();
            })
    }

</script>

<Label for="model-upload" class="text-xl mb-2">Select Model:</Label>
<input id="model-upload" type=file style="display: none;" bind:this={fileUploader} bind:files on:change={handleFileUploadChange}/>
<div class="flex flex-row border border-gray-400 rounded-lg !p-0 bg-gray-600 dark:text-gray-300">
    <Button color="dark" on:click={() => fileUploader.click()}>Browse</Button>
    <div id="model-upload-readout" class="m-auto align-text-middle">{$graphFile ?? "No file selected."}</div>
    <Button 
        color="none"
        class="p-0 pr-1 pl-1 mr-1 focus:outline-none text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        on:click={clearModel}
    >
        <XMark />
    </Button>
</div>
<Helper>PTH</Helper>
<div class="flex flex-row mt-4">
    <Button on:click={submitForm} disabled={uploadButtonDisabled}>Upload</Button>
    {#if uploadButtonDisabled}
        <Tooltip>Please select a new file to upload</Tooltip>
    {/if}
    <div id="model-validation" class="{validationClass} m-auto">
        {#if $modelValid}
        <CheckCircle style="margin-right: 5px;"/>
        {:else}
        <XCircle style="margin-right: 5px;"/>
        {/if}
        Model is {$modelValid ? "" : "not "}valid
    </div>
</div>

<style>
    #model-validation {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        min-width: 210px;
    }
</style>