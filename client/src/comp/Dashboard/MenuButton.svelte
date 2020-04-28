<style>
  x-menu-button {
    display: flex;
    padding: 0.75rem;
    margin: 0 0.5rem;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    border-radius: 50%;
    transition: margin 200ms ease;
  }

  .hidden {
    margin-inline-start: -3em;
    margin-inline-end: 2em;
  }
</style>

<script>
  import {getContext} from "svelte";
  import Menu from "svelte-material-icons/Menu.svelte";
  import {Ripple} from "svelte-mui";
  const {toggleDrawer} = getContext("dash");

  export let light;
  export let dark;
  export let hidden;
</script>

<x-menu-button class:hidden class:btn-light={light} class:btn-dark={dark} on:click={toggleDrawer}>
  <Menu />
  <Ripple />
</x-menu-button>
