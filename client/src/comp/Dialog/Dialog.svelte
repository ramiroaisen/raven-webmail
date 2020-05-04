
<style>
    x-overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        //border-top: var(--pc) 4px solid;
        overflow: hidden;
    }

    x-title {
        font-size: 1.25em;
        font-weight: 600;
        padding: 1em;
        background: rgba(0,0,0,0.1dialog);
        //border-bottom: var(--border-gray) 1px solid;
    }
</style>

<script>
    import {fade} from "svelte/transition";

    let isOpen = false;

    let title;
    let onClose;
    let modal


    const noop = () => {};
    // args:
    // title: string
    // onClose: function (if modal)
    // modal: boolean (false)
    export const open = (args = {}) => {
        title = args.title || null;
        onClose = args.onClose || null;
        modal = modal || false;
        isOpen = true;
    }

    export const close = () => {
        modal = false;
        onClose = null;
        title = null;
        isOpen = false;
    }


    const keydown = event => {
        if(isOpen && !modal && onClose && event.key === "Escape") {
            onClose();
        }
    }

</script>

<svelte:window on:keydown|capture={keydown} />

{#if isOpen}
    <x-overlay class:modal transition:fade={{duration: 200}} on:click={() => !modal && onClose && onClose()}>
        <x-dialog class="elevation-4" on:click|stopPropagation>
            {#if title != null}
                <x-title>{title}</x-title>
            {/if}
            <slot/>
        </x-dialog>
    </x-overlay>
{/if}
