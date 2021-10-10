<script lang="ts">
  export let label: string;
  export let open: boolean = false;

  export let anchorLeft: boolean = false;

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
    border: rgba(0,0,0,0.18) 1px solid;
  }
</style>

<div class="selector">
  <div class="button btn-dark" on:click={() => open = !open} class:hover={open}>
    {label}
    <Ripple />
  </div>

  <div class="anchor" class:anchor-left={anchorLeft}>
    <Popup anchor={anchorLeft ? "top-left" : "top-right"} bind:open>
      <slot />
    </Popup>
  </div>
</div>