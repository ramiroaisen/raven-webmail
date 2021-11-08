<script>
  import { watchAuth } from "$lib/util";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  onMount(() => watchAuth(null));
</script>

<style>
  .dash {
    width: 100%;
    min-height: 100%;
    background: #fff;
  }

  .top {
    height: var(--top-h);
    background: var(--red);
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .logo {
    font-weight: 500;
    font-size: 1.25rem;
    margin: 0 1.5rem;
  }
</style>

<div class="dash" in:fly|local={{duration: 400, y: -25}}>
  <div class="top">
    <div class="logo">Raven</div>
  </div>

  <div class="page">
    <slot />
  </div>
</div>