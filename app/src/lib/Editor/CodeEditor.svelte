<script lang="ts">
	import { to_number } from "svelte/internal";

  export let html: string;
  export let onChange: ((html: string) => void) | null = null;

  $: lines = html.split("\n").length;
</script>

<style>
  .wrap {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    font-size: 1rem;
    --line-height: 1.1rem;
  }

  .lines {
    font-size: 0.8rem;
    padding: 0.5rem;
    flex: none;
    font-family: monospace;
    border-right: #ccc 1px solid;
    text-align: right;
    line-height: var(--line-height);
  }
  
  textarea {
    line-height: var(--line-height);
    flex: 1;
    font-size: inherit;
    font-family: monospace;
    padding: 0.5rem;
    outline: 0;
    border: 0;
    margin: 0;
    display: block;
    resize: none;
    white-space: nowrap;
  }
</style>

<div class="wrap">
  <div class="lines">
    {#each Array(lines).fill(0) as n, i}
      <div class="line">{i + 1}</div>
    {/each}
  </div>
  <textarea bind:value={html} on:input={() => onChange?.(html)} />
</div>