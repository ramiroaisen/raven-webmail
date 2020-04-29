<script context="module">
  export const contexts = new WeakMap();
</script>

<style>
  x-upload {
    display: flex;
    position: relative;
  }
  
  x-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    color: #444;
  }

  x-action:hover {
    color: #111;
  }

  x-action > :global(svg) {
    font-size: 1.5em;
  }

  input {
    display: none;
  }

  x-bubble {
    position: absolute;
    background: var(--pc);
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    font-size: 0.7em;
    color: #fff;
    box-shadow: rgba(0,0,0,0.4) 0 0 3px 0;
    top: 0;
    right: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  x-popup {
    filter: drop-shadow(rgba(0,0,0,0.4) 0 0 3px);
    transform: translate(0, 0.4em);
  }

  x-popup-body {
    position: absolute;
    top: -0.75em;
    right: -6em;
    width: 20rem;
    max-height: 70vh;
    background: #fff;
    border-radius: 3px;
    display: flex;
    max-width: 80vw;
    transform: translate(0, -100%);
    flex-direction: column;
  }

  x-popup-top {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 0.5em;
    flex: none;
  }
  
  x-label {
    flex: 1;
    margin: 0.5em;
  }

  x-scroll {
    padding: 0 0.5em;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .arrow {
    position: absolute;
    left: 0;
    top: 0;
    width: 1.25em;
    height: 0.75em;
    margin-top: -0.8em;
    margin-left: -2.2em;
  }

  x-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

</style>

<script>
  export let files;
  export let input;
  export let open = false;
  export let loading = false;

  import {setContext, getContext} from "svelte";
  import {fly, scale} from "svelte/transition";
  import FileItem from "./FileItem.svelte";
  import CircularProgress from "comp@CircularProgress.svelte";
  import Clip from "svelte-material-icons/Paperclip.svelte"
  import {Button, Ripple} from "svelte-mui";
  import {createContext} from "./upload";

  const change = (e) => {
    
    for(const file of input.files) {
      ctx.add(file)
    }

    if (input.files.length) {
      ctx.open.set(true);
    }

    input.value = null;
  }

  const {key} = getContext("compose");
  
  let ctx;
  if(contexts.has(key)) {
    ctx = contexts.get(key);
  } else {
    ctx = createContext({files, open, loading});
    contexts.set(key, ctx);
  }

  ctx.open.subscribe(v => open = v);
  ctx.loading.subscribe(v => loading = v)
  ctx.files.subscribe(fs => {
    files = fs.map(f => {
      const {filename, id, contentType, size} = f.get();
      return {filename, id, contentType, size};
    })
  })

  let ctxFiles = ctx.files;

  setContext("upload", ctx);

  const click = e => {
    if (files.length === 0) {
      input.click();
    } else {
      ctx.open.update(o => !o);
    }
  }

  export let locale;
</script>

<x-upload>
  
  <input bind:this={input} on:change={change} type="file" name="0-upload" id="0-upload" multiple>
  
  <x-action class="upload btn-dark" data-tooltip={open ? null : locale.tooltip} on:click={click}>
    <Clip/>
    <Ripple />
    {#if loading}
      <x-loading>
        <CircularProgress size="100%"/>
      </x-loading>
    {/if}
    {#if $ctxFiles.length}
      <x-bubble transition:scale={{duration: 200}}>
        {$ctxFiles.length}
      </x-bubble>
    {/if}
  </x-action>

  {#if open}
    <x-popup transition:fly={{x: 0, y: 20, duration: 250}}>
      <svg class="arrow" viewBox="0 0 24 24" preserveAspectRatio="none">
        <path d="M0 0 L24 0 L12 24 L 0 0" fill="#fff"/>
      </svg>
      <x-popup-body>
        <x-scroll>
          {#each $ctxFiles as file (file)}
            <FileItem {file} removeTooltip={locale.remove} />
          {/each}
        </x-scroll>
        <x-popup-top>
          <x-label></x-label>
          <Button on:click={() => input.click()}>{locale.add}</Button>
        </x-popup-top>
      </x-popup-body>
    </x-popup>
  {/if}
</x-upload>
  

