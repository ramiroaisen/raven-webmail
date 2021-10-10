<script lang="ts">
  export let open: boolean = false;
  export let anchorLeft: boolean = false;
  export let icon: any;

  import Popup from "./Popup.svelte";
  import Ripple from "./Ripple.svelte";
</script>

<style>
  .selector {
    position: relative;
  }

  .anchor {
    position: absolute;
    bottom: 0;
  }

  .anchor:not(.anchor-left){
    right: 0;  
  }

  .anchor-left {
    left: 0;
  }

  .button {
    font-size: 0.9rem;
    padding: 0.75rem;
    border-radius: 1000px;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .icon {
    display: flex;
    font-size: 1.5rem;
  }
</style>

<div class="selector">
  <div class="button btn-dark" on:click={() => open = !open} class:hover={open}>
    <div class="icon">
      <svelte:component this={icon} />
    </div>
    <Ripple />
  </div>

  <div class="anchor" class:anchor-left={anchorLeft}>
    <Popup anchor={anchorLeft ? "top-left" : "top-right"} bind:open>
      <slot />
    </Popup>
  </div>
</div>