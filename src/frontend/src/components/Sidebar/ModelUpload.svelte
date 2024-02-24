<script lang="ts">
    import { Button, Label, Helper, Tooltip } from 'flowbite-svelte';
    import { CheckCircle, XCircle, XMark } from 'svelte-heros-v2';
    import api from '../../utils/api';
    import { modelValid, graphFile, graph, uploading } from '../../utils/stores';
    import { sendToast, getResponseError } from '../../utils/utils';
    import type { AxiosResponse } from 'axios';

    let fileUploader;
    let files: FileList;
    let validationClass: string;
    let uploadButtonDisabled: boolean = $uploading || $modelValid;

    $: validationClass = $modelValid ? "text-success-800 dark:text-success-200" : "text-error-800 dark:text-error-200";

    $: $graphFile = files ? files[0]?.name ?? '' : $graphFile;

    $: uploadButtonDisabled = $uploading || $modelValid;

    function clearModel() {
        $graph = { nodes: [], links: [], activations: [] }
        $modelValid = false;
        $graphFile = null;
        files = null;
    }

    function handleFileUploadChange() {
        $modelValid = false;
    }

    function submitForm() {
        $uploading = true;
        api.post('/graph', files, { timeout: 30000})
            .then((res: AxiosResponse) => {
                $graph = { nodes: res.data.graph.nodes, links: res.data.graph.links, activations: res.data.graph.activations }
                $modelValid = true;
                $uploading = false;
                sendToast("success", "Model uploaded successfully");
            })
            .catch((err: Error) => {
                console.log(err)
                let [_, message] = getResponseError(err);
                sendToast("error", `${message}`);
                $uploading = false;
                clearModel();
            })
    }

</script>

<Label for="model-upload" class="text-xl mb-2">Select Model:</Label>
<input id="model-upload" type=file class="hidden" bind:this={fileUploader} bind:files on:change={handleFileUploadChange}/>
<div 
    class="flex flex-row border border-neutral-500 dark:border-neutral-600 rounded-lg 
        !p-0 bg-neutral-400 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-300
        w-full"
>
    <Button color="dark" on:click={() => fileUploader.click()}
        class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-2.5 
            text-sm text-white bg-neutral-600 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-600 focus:ring-neutral-300 
            dark:focus:ring-neutral-700 rounded-lg"
    >
        Browse
    </Button>
    <div id="model-upload-readout"
        class="my-auto text-neutral-600 dark:text-neutral-50 ml-1.5 mr-1.5
        overflow-x-hidden text-ellipsis grow text-center"
    >
        {$graphFile ?? "No file selected."}
    </div>
    <Tooltip class="bg-neutral-700 text-white dark:bg-neutral-800">{$graphFile ?? "No file selected."}</Tooltip>
    <Button 
        color="none"
        class="p-0 pr-2 pl-2 focus:outline-none text-neutral-700 dark:text-neutral-50 hover:text-neutral-900 
            dark:hover:text-white hover:bg-neutral-500 dark:hover:bg-neutral-600"
        on:click={clearModel}
    >
        <XMark />
    </Button>
</div>
<Helper>pth, keras</Helper>
<div class="flex flex-row mt-4">
    <Button on:click={submitForm} disabled={uploadButtonDisabled}>Upload</Button>
    {#if uploadButtonDisabled}
        <Tooltip class="bg-neutral-700 text-white dark:bg-neutral-800">Please select a new file to upload</Tooltip>
    {/if}
    <div id="model-validation" class="flex justify-center items-center p-4 min-w-[210px] m-auto {validationClass}">
        {#if $modelValid}
        <CheckCircle class="mr-1"/>
        {:else}
        <XCircle class="mr-1"/>
        {/if}
        Model is {$modelValid ? "" : "not "}valid
    </div>
</div>