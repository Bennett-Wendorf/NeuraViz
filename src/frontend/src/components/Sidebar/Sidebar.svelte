<script lang="ts">
    import { DarkMode, Label, Button } from 'flowbite-svelte';
    import ModelUpload from './ModelUpload.svelte';
    import { sendToast } from '../../utils/utils';

    let modelValid: boolean = true;
    let validationClass: string;

    $: validationClass = modelValid ? "text-success" : "text-error";
</script>

<div id="sidebar" color="secondary-background">
    <div id="testing-functions" style="display: none;">
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
    <div class='sidebar-row' style="flex-direction: column">
        <ModelUpload/>
    </div>
    <div class="mb-4">
        <p id="settings-label" class="leading-relaxed font-semibold text-3xl text-center dark:text-gray-400">
            Settings
        </p>
        <hr class="sidebar-divider"/>
    </div>
    <div class='sidebar-row'>
        <DarkMode />
        <Label for="dark-mode" class="m-auto ml-2 mr-2 text-white dark:text-gray-400">Dark Mode</Label>
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

    #settings-label {
        margin-top: 1rem;
        margin-bottom: .25rem;
    }

    .sidebar-divider {
        width: 95%;
    }
</style>