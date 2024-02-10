<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import api from '../../utils/api';

    import { sendToast, getResponseError } from '../../utils/utils';
    import type { AxiosResponse } from 'axios';

    function retrieveTikz() {
        api.get('/graph/tikz')
            .then((res: AxiosResponse) => {
                let tikz = res.data.tikz;
                let a = document.createElement('a');
                let file = new Blob([tikz], {type: 'text/plain'});
                a.href = URL.createObjectURL(file);
                a.download = 'model.tex';
                a.click();
            })
            .catch((err: Error) => {
                console.log(err);
                let [_, message] = getResponseError(err);
                sendToast("error", `${message}`);
            })
    }
</script>

<div class="flex flex-row gap-2 justify-center">
    <Button on:click={retrieveTikz}>
        Export as LaTeX
    </Button>
</div>