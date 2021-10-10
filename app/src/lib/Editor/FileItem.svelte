<script lang="ts">
  export let file: MessageFile;
  export let onRemove: () => void;

  import Error from "svelte-material-icons/AlertCircle.svelte";
  import Success from "svelte-material-icons/CheckCircleOutline.svelte";
  import Remove from "svelte-material-icons/Close.svelte";  
  import { url } from "$lib/fileIcons";
  import { quadOut } from "svelte/easing"; 
  import Ripple from "$lib/Ripple.svelte";
  import { tooltip } from "$lib/actions";
  import { fileError, fileLoaded, fileState, MessageFile } from "$lib/Compose/compose";
import { locale } from "$lib/locale";

  const out = (node: HTMLElement, params: any) => {
    const h = node.clientHeight;
    return {
      easing: quadOut,
      ...params,
      css: (t: number, u: number) => {
        return `z-index: 1; margin-top: -${u * h}px; opacity: ${t};`
      }
    }
  }
</script>

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
    width: 3em;
    height: 3em;
    background: #ddd;
    border-radius: 3px;
    margin-inline-end: 1em;
    position: relative;
  }

  x-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-inline-end: 1em;
    flex: 1;
  }

  x-progress {
    background-color: var(--red);
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


<x-file out:out|local={{duration: 150}}>
  <x-icon>
    <img src={url(file.filename)} alt="" width="100%" height="100%">
  </x-icon>
  <x-name>{file.filename}</x-name>
  {#if file[fileState] === "uploading"}
    <x-progress style="width: {(file[fileLoaded] / file.size) * 100}%"/>
  {:else if file[fileState] === "complete" || file[fileState] == null}
    <x-state class="complete">
      <Success />
    </x-state>
  {:else if file[fileState] === "error"}
    <x-state class="error" use:tooltip={file[fileError]}>
      <Error />
    </x-state>
  {/if}
  <x-action class="remove btn-dark" use:tooltip={$locale.Remove} on:click={onRemove}>
    <Remove />
    <Ripple />
  </x-action>
</x-file>