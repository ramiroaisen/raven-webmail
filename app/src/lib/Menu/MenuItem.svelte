<script lang="ts">
  import type SvelteComponent from "svelte-material-icons/Check.svelte";
  export let icon: typeof SvelteComponent | undefined = void 0;
  export let href: string | undefined = void 0;
  export let iconPlaceholder: boolean = false;
  export let target: string | undefined = void 0;
  export let download: boolean | string | undefined = void 0; 
  import Ripple from "../Ripple.svelte";
</script>

<style>
  .menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2.5rem;
    color: #333;
    padding-inline-end: 1rem;
  }

  .noplaceholder {
    padding-inline-start: 1rem;
  }

  .icon {
    flex: none;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    font-size: 1.25rem;
  }
</style>

<a
  class="menu-item na btn-dark"
  class:noplaceholder={!icon && !iconPlaceholder}
  {href}
  {target}
  on:click
  on:pointerdown
  {download}
 >
  {#if icon || iconPlaceholder}
    <div class="icon">
      {#if icon}
        <svelte:component this={icon} />
      {/if}
    </div>
  {/if}
  <slot />
  <Ripple />
</a>
