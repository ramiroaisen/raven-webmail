<script lang="ts">
  export let checked: boolean = false;
  export let id: string | undefined = void 0;
  export let readonly: boolean = false;
  export let onChange: (v: boolean) => void = () => {};
  import Ripple from "./Ripple.svelte";
  import {fade} from "svelte/transition";
  import On from "svelte-material-icons/CheckboxMarked.svelte";
  import Off from "svelte-material-icons/CheckboxBlankOutline.svelte";

  let lastValue = checked;
  $: onChecked(checked);
  const onChecked = (v: boolean) => {
    if(lastValue === v) return;
    lastValue = v;
    onChange(v);
  }
</script>

<style>
  .checkbox {
    flex: none;
    position: relative;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: #111;
    transition: color 200ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checked {
    color: var(--red);
  }

  .on, .off {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    position: absolute;
    font-size: 1.25rem;
  }

  input {
    display: none;
  }
</style>

<div class="checkbox btn-dark" class:checked on:click={() => !readonly && (checked = !checked)}>
  {#if checked}
    <div class="on" transition:fade|local={{duration: 100}}>
      <On />
    </div>
  {:else}
    <div class="off" transition:fade|local={{duration: 100}}>
      <Off />
    </div>
  {/if}
  <input type="checkbox" disabled={readonly} {id} bind:checked /> 
  <Ripple center/>
</div>