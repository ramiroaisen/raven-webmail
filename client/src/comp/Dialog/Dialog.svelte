
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

    import {onceBackButton} from "lib@onceBackButton.js";
    import {once} from "lib@util.js";

    let isOpen = false;

    let title;
    let onClose;
    let modal

    let close;

    // args:
    // title: string
    // onClose: function (if modal)
    // modal: boolean (false)

    export const open = (args = {}) => {
        title = args.title || null;
        modal = modal || false;
        isOpen = true;

        let trigger = true;

        let remove;

        const _close = () => {
            modal = false;
            title = null;
            isOpen = false;
            remove && remove();
            trigger && args.onClose && args.onClose();
        }

        if(!modal) {
            remove = onceBackButton(_close);
            close = once(() => history.back())
        } else {
            close = once(_close);
        }

        return () => {
            trigger = false;
            close();
        }
    }

    const keydown = event => {
        if(isOpen && !modal && event.key === "Escape") {
            close();
        }
    }

</script>

<svelte:window on:keydown|capture={keydown} />

{#if isOpen}
    <x-overlay class:modal transition:fade={{duration: 200}} on:click={() => !modal && close()}>
        <x-dialog class="elevation-4" on:click|stopPropagation>
            {#if title != null}
                <x-title>{title}</x-title>
            {/if}
            <slot/>
        </x-dialog>
    </x-overlay>
{/if}
