<script lang="ts">
  export let key: any = null;
  import { fly } from "svelte/transition";
</script>

<style>
  .page {
		flex-direction: column;
    height: 100%;
	}
</style>

{#key key}
  <div class="page" in:fly={{ x: -25, duration: 300 }}>
    <slot />
  </div>
{/key}