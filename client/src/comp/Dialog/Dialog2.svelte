
<style>
    x-overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 300;
    }

    x-overlay.modal {
        cursor: default;
    }

    x-dialog {
        max-width: 90%;
        width: 30em;
        background: #fff;
        border-right: 0.25em;
        display: flex;
        flex-direction: column;
        border-radius: 0.25em;
        overflow: hidden;
    }

    x-title {
        font-size: 1.25em;
        font-weight: 600;
        padding: 1em;
        background: rgba(0,0,0,0.1dialog);
    }
</style>

<script>
    import {fade} from "svelte/transition";

    import {onceBackButton} from "lib@onceBackButton.js";
    import {once} from "lib@util.js";

    export let open;
    export let title = null;
    export let modal = false;
    
    const keydown = event => {
        if(open && !modal && event.key === "Escape") {
            open = false;
        }
    }

</script>

<svelte:window on:keydown|capture={keydown} />

<x-overlay class:modal transition:fade={{duration: 200}} on:click={() => !modal && (open = false)}>
    <x-dialog class="elevation-4" on:click|stopPropagation>
        {#if title != null}
            <x-title>{title}</x-title>
        {/if}
        <slot/>
    </x-dialog>
</x-overlay>
