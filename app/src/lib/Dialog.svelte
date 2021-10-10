<script lang="ts">
  import { onMount } from "svelte";
  import { add } from "./actions";

  export let title: string | undefined = void 0;
  export let width: string = "800px";
  export let padding: string = "1.5rem";
  export let onClose: () => void = () => {};

  onMount(() => add(window, "keydown", (event: Event) => {
    if((event as KeyboardEvent).key === "Escape") onClose();
  }, { capture: true }))

  import { fade } from "svelte/transition";

  const custom = (node: Element, options = {}) => {
    return {
      duration: 150,
      css: (t: number, u: number) => `transform: translateY(${100 * u}px) scale(${0.5 + 0.5 * t}); opacity: ${t}` 
    }
  }
</script>

<style>
  .overlay {
    display: flex;
    box-sizing: border-box;
    padding: 5rem 1rem;
    cursor: pointer;
    position: absolute;
    background: rgba(0,0,0,0.4);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000000;
  }

  .dialog {
    cursor: default;
    width: var(--width);
    max-width: 90%;
    margin: auto;
    background: #fff;
    margin: auto;
    box-sizing: border-box;
    /*overflow: hidden;*/
  }

  .title {
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    /*
    background: rgba(0,0,0,0.05);
    border-bottom: rgba(0,0,0,0.18) 1px solid;
    */
    border-top: 2px var(--red) solid;
  }

  .content {
    padding: var(--padding);
  }
</style>

<div class="overlay" on:click={onClose} transition:fade|local={{duration: 200}}>
  <div class="dialog elev3" style="--width: {width}; --padding: {padding}" on:click|stopPropagation={() => {}} transition:custom|local>
    {#if title}
      <div class="title">{title}</div>
    {/if}
    <div class="content">
      <slot />
    </div>
  </div>
</div>