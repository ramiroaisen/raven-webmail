<style>
  x-file {
    position: relative;
    min-width: auto;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    padding: 0.5em 0;
    flex: none;
    background: #fff;
  }

  x-file:not(:only-child) {
    border-bottom: var(--border-gray) 1px solid;
  }

  x-icon {
    flex: none;
    width: 4em;
    height: 4em;
    background: #ddd;
    border-radius: 3px;
    margin-inline-end: 1em;
    position: relative;
  }

  x-extension {
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.25em 0.5em;
    position: absolute;
    right: -0.5em;
    bottom: -0.5em;
    border-radius: 0.2em;
    background: rgba(0,0,0,0.45);
    font-size: 0.8em;
    color: #fff;
    text-shadow: #000 0 0 2px;
  }

  x-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-inline-end: 1em;
    flex: 1;
  }

  x-progress {
    background-color: var(--pc);
    position: absolute;
    height: 3px;
    left: 0;
    bottom: 0;
    transition: width 300ms ease; 
  }

  x-state {
    font-size: 1.5em;
    border-radius: 50%;
    display: flex;
    flex: none;
    padding: 0.25em;
  }

  .complete {
    color: #558b2f;
  }

  .error {
    color: #7f0000;
  }

  .remove {
    border-radius: 50%;
    padding: 0.75em;
    display: flex;
    flex: none;
  }

  .remove:before {
    top: 50%;
    left: -1em;
    transform: translate(-100%, -50%);
  }
</style>

<script>
  export let file;
  import {upload} from "./upload";
  import {getNotifier} from "comp@Notify/notify.js";

  import {slide} from "svelte/transition";

  import Error from "svelte-material-icons/AlertCircle.svelte";
  import Success from "svelte-material-icons/CheckCircleOutline.svelte";
  import Remove from "svelte-material-icons/Close.svelte";  

  import {Ripple} from "svelte-mui";

  import {url, extname} from "lib@fileIcons.js";

  import {getContext} from "svelte";
  const {remove} = getContext("upload");

  import {quadOut} from "svelte/easing"; 

  $: ext = extname($file.filename);

  const out = (node, params) => {
    const h = node.clientHeight;
    return {
      easing: quadOut,
      ...params,
      css: (t, u) => {
        return `z-index: 1; margin-top: -${u * h}px; opacity: ${t};`
      }
    }
  }
</script>


<x-file out:out|local={{duration: 150}}>
  <x-icon>
    <img src={url($file.filename)} alt="" width="100%" height="100%">
    {#if ext}
      <x-extension>{ext}</x-extension>
    {/if}
  </x-icon>
  <x-name>{$file.filename}</x-name>
  {#if $file.state === "uploading"}
    <x-progress style="width: {($file.loaded / $file.size) * 100}%"/>
  {:else if $file.state === "complete"}
    <x-state class="complete">
      <Success />
    </x-state>
  {:else if $file.state === "error"}
    <x-state class="error" data-tooltip={$file.errorMessage}>
      <Error />
    </x-state>
  {/if}
  <x-action class="remove btn-dark" data-tooltip="Eliminar" on:click={() => remove(file)}>
    <Remove />
    <Ripple />
  </x-action>
</x-file>