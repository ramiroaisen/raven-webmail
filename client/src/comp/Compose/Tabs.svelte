<style>
  x-tabs {
    position: fixed;
    z-index: 110;
    right: 0;
    bottom: 0;
    margin-right: 8em; 
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap-reverse;
  }

  x-tab {
    position: relative;
    display: flex;
    width: 14em;
    height: 2.25em;
    background: #404040;
    color: #fff;
    margin-inline-end: 1em;
    margin-top: 1em;
    cursor: pointer;
    user-select: none;
    border-color: rgba(0,0,0,0.2);
    border-style: solid;
    border-width: 1px 1px 0 1px;
    border-radius: 0.4em 0.4em 0 0;
    font-weight: 600;
    align-items: center;
    max-width: calc(100vw - 8em - 2em)
  }

  .current {
    visibility: hidden;
  }

  x-tab-crossfade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }

  x-tab-title {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 0.5em;
  }

  x-tab-close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5em;
    height: 1.5em;
    margin-inline-end: 0.25em;
    transition: background-color 150ms ease;
    border-radius: 2px;
  }

  x-tab-close:hover {
    background-color: rgba(255,255,255,0.15);
  } 

  x-tab-close:active {
    background-color: rgba(255,255,255,0.25);
  }
</style>

<script>
  import {fade} from "svelte/transition";
  import {flip} from "svelte/animate";
  import Compose from "./Compose.svelte";
  import {wins, current, send, receive} from "./compose";
  import Close from "svelte-material-icons/Close.svelte";
  
  const open = self => current.set(self);
  
  const close = self => {
    if ( self === $current ) {
      current.set(null);
    }
    wins.update(w => w.filter(w => w !== self)); 
  }
  
  let minimize = () => current.set(null);

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l.compose.tabs;
</script>

{#if $wins.length}
  <x-tabs>
    {#each $wins as self (self)}
      <x-tab class:current={self === $current} transition:fade={{duration: 300}} animate:flip={{duration: 300}} on:click={() => open(self)}>
        <x-tab-title>{locale.newMessageTitle}</x-tab-title>
        <x-tab-close on:click|stopPropagation={() => close(self)}>
          <Close />
        </x-tab-close>
        {#if $current !== self}
          <x-tab-crossfade in:receive|local={{key: self}} out:send|local={{key: self}}></x-tab-crossfade>
        {/if}
      </x-tab>
    {/each}
  </x-tabs>

  {#if $current}
    <x-overlay transition:fade={{duration: 300}} on:click={minimize}></x-overlay>
  {/if}

  {#each $wins as self (self)}
    <Compose {self} />
  {/each}
{/if}