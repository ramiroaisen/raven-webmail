<style>
    .anchor {
        position: fixed;
        width: 0;
        height: 0;
    }

    .popup {
        position: relative;
        width: max-content;
        display: flex;
        flex-direction: column;
        min-width: 10em;
        background: #fff;
        border-radius: 3px;
    }

    .bottom-left {
        transform: translate(0, -100%);
    }

    .bottom-center {
        transform: translate(-50%, -100%);
    }

    .bottom-right {
        transform: translate(-100%, -100%);
    }

    .top-left {
        transform: translate(0, 0);
    }

    .top-center {
        transform: translate(-50%, 0);
    }

    .top-right {
        transform: translate(-100%, 0);
    }
</style>

<script>
    export let open = false;
    export let anchor = "top-right";
                        // bottom-left bottom-left bottom-center top-left top-right top-center

    import {onMount, onDestroy} from "svelte";

    const click = () => open && setTimeout(() => open = false, 5);
    onMount(() => document.addEventListener("click", click, true))
    onDestroy(() => document.removeEventListener("click", click, true))

    import {fade} from "svelte/transition";

    const accommodate = node => {
        const rect = node.getBoundingClientRect();
        const bound = {
            x: 5,
            y: 5,
            right: window.innerWidth - 5,
            bottom: window.innerHeight - 5
        }
        if(bound.right < rect.right) {
            node.style.marginLeft = `${bound.right - rect.right}px`;
        } else if(bound.x > rect.x){
            node.style.marginLeft = `${rect.x - bound.x}px`
        }

        if(bound.bottom < rect.bottom) {
            node.style.marginTop = `${bound.bottom - rect.bottom}px`;
        } else if(bound.y > rect.y) {
            node.style.marginTop = `${rect.y - bound.y}px`;
        }
    }
</script>

<div class="anchor">
    {#if open}
        <div class="popup elevation-3 {anchor}" transition:fade|local={{duration: 100}} use:accommodate>
            <slot />
        </div>
    {/if}
</div>