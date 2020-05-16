<script>
  import Preloading from "./Preloading.svelte";

  export let router;
  $: render = router._render;
  $: page = router.page;
</script>

{#if $render}
  {#each [0] as _ ($page.path)}
    <svelte:component this={$render.component} {...($render.args || {})}/>
  {/each}
{:else}
  <slot />
{/if}
