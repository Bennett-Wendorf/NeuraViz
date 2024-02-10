<script lang="ts">
    import { DarkMode, Label, Button } from 'flowbite-svelte';
    import ModelUpload from './ModelUpload.svelte';
    import TikzExport from './TikzExport.svelte';
    import Key from '../Graph/Key.svelte';
    import { sendToast } from '../../utils/utils';
</script>

<div id="sidebar" 
    class="bg-secondarybackground-200 
        dark:bg-secondarybackground-800 border-r-[1px] border-solid 
        border-secondarybackground-800 dark:border-black h-screen
        max-w-[23rem] min-w-[23rem] z-40 p-4 flex flex-col"
>
    <div id="testing-functions" class="hidden">
        <div class='sidebar-row flex-row gap-1'>
            <Button data-testid="default-toast" on:click={() => sendToast()}> Send Default Toast </Button>
            <Button data-testid="default-info-toast" on:click={() => sendToast('info')}> Send Info Toast </Button>
            <Button data-testid="default-success-toast" on:click={() => sendToast('success')}> Send Success Toast </Button>
            <Button data-testid="default-error-toast" on:click={() => sendToast('error')}> Send Error Toast </Button>
        </div>
        <br />
        <div class='sidebar-row flex-row gap-1'>
            <Button data-testid="default-warning-toast" on:click={() => sendToast('warning')}> Send Warning Toast </Button>
            <Button data-testid="success-success-message-toast" on:click={() => sendToast('success', `Something was successful`)}> Send Success Message Toast </Button>
            <Button data-testid="infinite-timeout-toast" on:click={() => sendToast('info', `I'll never leave!`, Infinity)}> Infinite Timeout Toast </Button>
        </div>
    </div>
    <div class='sidebar-row flex-col'>
        <ModelUpload/>
    </div>
    <div class='sidebar-row flex-col mt-4'>
        <TikzExport/>
    </div>
    <div class="mb-4">
        <p id="settings-label"
            class="leading-relaxed font-semibold text-3xl 
                text-center text-neutral-800 dark:text-neutral-400
                mt-4 mb-1"
        >
            Settings
        </p>
        <hr class="w-full border-neutral-800 dark:border-neutral-400"/>
    </div>
    <div class="grow">
        <div class="sidebar-row">
            <DarkMode data-testid="dark_mode_button" btnClass="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 
                dark:hover:bg-neutral-700 focus:outline-none focus:ring-4 
                focus:ring-neutral-400 dark:focus:ring-neutral-700 rounded-lg text-sm p-2.5" 
            />
            <Label for="dark-mode" class="m-auto ml-2 mr-2 text-neutral-800 dark:text-neutral-400">
                Dark Mode
            </Label>
        </div>
    </div>
    <div class='sidebar-row'>
        <Key />
    </div>
</div>

<style lang="postcss">
    .sidebar-row {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>