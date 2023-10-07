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

<div id={`toast-${id}`} class="toast" transition:fly = "{{ x: 400, duration: 200 }}">
    <Toast 
        simple={true}
        color={getTypeColor(type)} 
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
        <div class="flex flex-row items-center">
            <p>{message}</p>
            <Button
                color="none"
                class="focus:outline-none whitespace-normal m-0.5 rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 focus:!ring-gray-300 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
                on:click={close}
            >
                <XMark />
            </Button>
        </div>
    </Toast>
</div>

<style>
    :global(.toast) {
        float: right;
        margin-top: 1rem;
        margin-right: 1rem;
    }
</style>