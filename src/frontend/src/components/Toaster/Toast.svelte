<script lang="ts">
    import { Toast, Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { CheckCircle, ExclamationCircle, InformationCircle, XCircle, XMark } from 'svelte-heros-v2';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    export let id: number;
    export let type = 'info';
    export let duration: number;
    export let message;

    const dispatch = createEventDispatcher();

    function getTypeColor(type) {
        switch (type) {
            case 'success':
                return 'green';
            case 'error':
                return 'red';
            case 'warning':
                return 'yellow';
            case 'info':
                return 'blue';
        }
    }

    function close() {
        dispatch('close');
    }

    onMount(() => {

        if (duration != Infinity) {
            setTimeout(close, duration * 1000);
        }
    });
</script>

<div id={`toast-${id}`} class="toast float-right mt-4 mr-4" transition:fly = "{{ x: 400, duration: 200 }}">
    <Toast 
        simple={true}
        color={getTypeColor(type)}
        divClass="w-full max-w-xs p-4 text-neutral-800 bg-secondarybackground-200 shadow dark:text-neutral-400 
            dark:bg-secondarybackground-800 gap-3"
    >
        <svelte:fragment slot="icon">
            {#if type == 'success'}
                <CheckCircle />
            {:else if type == 'error'}
                <XCircle />
            {:else if type == 'warning'}
                <ExclamationCircle />
            {:else if type == 'info'}
                <InformationCircle />
            {/if}
        </svelte:fragment>
        <div class="flex flex-row items-center gap-2.5">
            <p>{message}</p>
            <Button
                color="none"
                class="focus:outline-none whitespace-normal m-0.5 rounded-lg focus:ring-2 p-1.5 
                    focus:ring-neutral-400 -mx-1.5 -my-1.5 text-neutral-800 hover:text-neutral-900 
                    dark:focus:ring-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 
                    dark:hover:text-white dark:hover:bg-neutral-700"
                on:click={close}
            >
                <XMark />
            </Button>
        </div>
    </Toast>
</div>