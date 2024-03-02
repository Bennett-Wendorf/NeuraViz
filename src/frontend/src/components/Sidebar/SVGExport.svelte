<script lang="ts">
    import { Button, Tooltip } from 'flowbite-svelte';

    import { sendToast, getResponseError } from '../../utils/utils';

    import { modelValid } from '../../utils/stores';
    import * as d3 from 'd3';

    let exportButtonDisabled: boolean = !$modelValid;

    $: exportButtonDisabled = !$modelValid;

    function retrieveSVG() {
        var svgString = new XMLSerializer().serializeToString(d3.select('#graph>svg').node() as Node);

        var downloadLink = document.createElement('a');
        downloadLink.href = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
        downloadLink.download = 'model.svg';

        downloadLink.click();
    }
</script>

<div class="flex flex-row gap-2 justify-center ml-3">
    <Button on:click={retrieveSVG} disabled={exportButtonDisabled}>
        Export as SVG
    </Button>
    {#if exportButtonDisabled}
        <Tooltip class="bg-neutral-700 text-white dark:bg-neutral-800">Please upload a file before exporting</Tooltip>
    {/if}
</div>