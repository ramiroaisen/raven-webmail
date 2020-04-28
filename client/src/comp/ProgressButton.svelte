<style>
  .progress-button {
    position: relative;
  }

  .button {
    transition: opacity 300ms ease;
  }

  .inprogress > .button {
    opacity: 0.5;
  }

  .progress{
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .progress > :global(.circular-progress){
    height: 1.25em;
    width: 1.25em;
  }

  .progress-button-in{
    display: flex;
    flex-direction: row;
  }
</style>

<script>
  import {Button} from 'svelte-mui';
  import CircularProgress from './CircularProgress.svelte';

  export let inprogress = false;
  export let progress = {};

  $: disabled = inprogress;
</script>

<div class="progress-button" class:inprogress>
  <div class="button">
    <Button
      disabled={inprogress}
      {...$$props}
      on:click
      on:change
      on:focus
      on:blur
    >
      <span class="progress-button-in">
        <slot/>
      </span>
    </Button>
  </div>

  {#if inprogress}
    <div class="progress">
      <CircularProgress {...progress} />
    </div>
  {/if}
</div>