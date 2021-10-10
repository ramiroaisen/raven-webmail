<style>
    .anchor {
        position: absolute;
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
        z-index: 100000;
    }

    .wide {
        width: 100%;
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

<script lang="ts">
    export let autoClose: boolean = true;
    export let wide = false;
    export let anchor: Anchor = "top-right";
    
    const openCtx = getContext("popup-open") as Writable<boolean> || writable(false);
    export let open = $openCtx;
    
    import { getContext } from "svelte";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
    
    
     type Anchor = "top-right" | 
                   "top-left" | 
                   "top-center" | 
                   "bottom-left" | 
                   "bottom-right" | 
                   "bottom-center";

    $: onOpenChange(open);
    const onOpenChange = (open: boolean) => $openCtx = open;
    $: onOpenCtxChange($openCtx);
    const onOpenCtxChange = (ctx: boolean) => open = ctx;
    
    import {onMount} from "svelte";

    const click = () => open && setTimeout(() => {
        if(autoClose) open = false
    }, 5);

    onMount(() => {
        document.addEventListener("click", click, true)
        return () => {
            document.removeEventListener("click", click, true);
        }
    })

    import {fade} from "svelte/transition";

    const accommodate = (node: HTMLElement) => {
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
        <div class="popup elev3 {anchor}" class:wide transition:fade|local={{duration: 100}} use:accommodate>
            <slot />
        </div>
    {/if}
</div>