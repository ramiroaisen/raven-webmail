<script lang="ts" context="module">
  export const ssr = true;
  export const router = false;
</script>

<script lang="ts">
  import { locale } from "$lib/locale";
  import Ripple from "$lib/Ripple.svelte";
</script>

<svelte:head>
  <title>{$locale.Offline_title}</title>
</svelte:head>

<style>
  .page {
    padding: 2rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }
</style>

<div class="page">
  <h1>{$locale.Offline_title}</h1>
  <p>{$locale.Offline_message}</p>
  <button href="/" class="btn-light btn-primary elev2" on:click={() => window.location.reload()}>
    {$locale.Retry}
    <Ripple />
  </button>
</div>