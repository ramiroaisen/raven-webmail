<script lang="ts">
	export let autoClose: boolean = true;
	export let wide = false;
	export let anchor: Anchor = 'top-right';

  let width = 0;
  let height = 0; 
  let top = 0;
  let left = 0;

	const openCtx = (getContext('popup-open') as Writable<boolean>) || writable(false);
	export let open = $openCtx;

	import { getContext, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	type Anchor =
		| 'top-right'
		| 'top-left'
		| 'top-center'
		| 'bottom-left'
		| 'bottom-right'
		| 'bottom-center';

	$: onOpenChange(open);
	const onOpenChange = (open: boolean) => ($openCtx = open);
	$: onOpenCtxChange($openCtx);
	const onOpenCtxChange = (ctx: boolean) => (open = ctx);

	import { onMount } from 'svelte';

	const click = () =>
		open &&
		setTimeout(() => {
			if (autoClose) open = false;
		}, 5);

	onMount(() => {
    const off = [  
      add(document, "click", click, {capture: true}),
      add(window, "blur", click, { capture: true }),
    ];

    return () => {
      run_all(off)
    } 
  })

  import { fade } from 'svelte/transition';
  import { add, portal } from "./actions";
import { run_all } from 'svelte/internal';


	const calculate = (node: HTMLElement) => {
    const calculate = async () => {
      await tick();
      const parent = node.parentElement;
      if(parent == null) return;
      const parentRect = parent.getBoundingClientRect();
      let _top = parentRect.top;
      let _left = parentRect.left;

      if(anchor === "top-right" || anchor === "bottom-right") {
        _left = _left - width;
      } else if(anchor === "bottom-center" || anchor == "top-center") {
        _left = _left - (width / 2)
      }

      if(anchor === "bottom-right" || anchor === "bottom-left" || anchor === "bottom-center") {
        _top = _top - height;
      }
      

      _top = Math.max(_top, 5);
      _top = Math.min(_top, window.innerHeight - height - 5);
      _left = Math.max(_left, 5);
      _left = Math.min(_left, window.innerWidth - width - 5);
      
      top = _top;
      left = _left;
    }

    calculate();
    const interval = setInterval(calculate, 250);
    const off = [
      add(window, "scroll", calculate, { capture: true }),
      add(window, "resize", calculate)
    ]


    return {
      destroy: () => {
        clearInterval(interval);
        run_all(off);
      }
    }
  }

  const popupTransition = (node: HTMLElement, opts = {}) => {
    let origin = anchor.replace("-", " ");
    return {
      duration: 150,
      css: (t: number, u: number) => {
        return `transform-origin: ${origin};` + 
                `opacity: ${t};` + 
                `transform: scale(${0.8 + (t * 0.2)});`
      }
    }
  }


</script>

<style>
  .anchor {
    position: absolute;
    width: 0;
    left: 0;
  }

	.popup {
		position: fixed;
		width: max-content;
		display: flex;
		flex-direction: column;
		min-width: 10em;
		background: #fff;
		border-radius: 3px;
		z-index: 100000000;
    max-width: calc(100% - 10px);
    max-height: calc(100% - 10px);
    overflow: auto;
  }

  .popup::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

	.wide {
		width: 100%;
	}
</style>


{#if open}
  <div class="anchor" use:calculate>
    <div
      class="popup elev3 thin-scroll"  
      class:wide
      bind:clientHeight={height} bind:clientWidth={width}
      style="top: {top}px; left: {left}px"
      transition:popupTransition|local
      use:portal
    >
      <slot />
    </div>
  </div>
{/if}