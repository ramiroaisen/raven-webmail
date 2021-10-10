<style>
  x-color-cell {
    width: 1.125em;
    height: 1.125em;
    margin: 2px;
    cursor: pointer;
    user-select: none;
  }
</style>

<script>
  import {getContext} from "svelte";
  const {cmd} = getContext("editor"); 
  
  export let variant;
  export let color;
</script>

<x-color-cell
  style="background-color: {color}"
  on:click={() => cmd(variant, color)}
>
</x-color-cell>
