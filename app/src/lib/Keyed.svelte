<script lang="ts">
  export let key: any = null;
</script>

{#each [0] as _ (key)}
  <slot />
{/each}