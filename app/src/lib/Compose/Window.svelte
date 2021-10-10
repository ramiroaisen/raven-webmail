<script lang="ts">
  export let current: Draft;
  export let onMinimize: () => void;
  export let onRemove: () => void;
  let iframe: HTMLIFrameElement;
  let cc: HTMLInputElement;
  let bcc: HTMLInputElement;

  $: showCc = current?.[kShowCc] || current?.bcc?.length;
  $: showBcc = current?.[kShowBcc] || current?.cc?.length;

  import { Draft, kSent, save } from "./compose";
  import { crossin, crossout } from "./compose";
  
  import { onMount } from "svelte";
  import { add } from "$lib/actions";
  import Editor from "$lib/Editor/Editor.svelte";
  import AddrInput from "./AddrInput.svelte";
 
  let prev = clone(current);
  let timer: any;
  let token = 1;
  let saved = true;
  $: onCurrent(current);
  const onCurrent = (current: Draft) => {
    if(isDraftEquals(prev, current)) return;
    prev = clone(current);
    saved = false;
    const t = ++token;
    clearTimeout(timer);
    timer = setTimeout(() => dosave(current, t), 1500);
  }

  const dosave = async (current: Draft, t: number) => {
    if(current[kSent]) return;
    const newId = await save(current);
    // here we dont trigger an invalidate
    current.id = newId;
    if(t === token) {
      saved = true;
    }
  }

  const isDraftEquals = (src: Draft, target: Draft): boolean => {
    const { id: id1, key: key1, ...item1 } = src;
    const { id: id2, key: key2, ...item2 } = target;
    return equals(item1, item2);
  }


  onMount(() => {
         
    const keydown = (event: KeyboardEvent) => { 
      if(event.key === "Escape") onMinimize();
    }

    const off = [
      add(document, "keydown", keydown, { capture: true }),
    ]

    if(iframe && iframe.contentDocument) {
      off.push(add(iframe.contentDocument, "keydown", keydown, { capture: true }));
    }

    return () => {
      if(!saved) dosave(current, ++token);
      clearTimeout(timer);
      run_all(off);
    }
  })

  import Ripple from "$lib/Ripple.svelte";
  import Close from "svelte-material-icons/Close.svelte";
  import Minimize from "svelte-material-icons/ColorHelper.svelte";
  import NotSaved from "svelte-material-icons/CircleSmall.svelte";
  import { kShowBcc, kShowCc } from "./compose";
  import { clone, equals } from "$lib/util";
  import { run_all } from "svelte/internal";
import { locale } from "$lib/locale";

  const savingSlide = (node: HTMLElement, options: {}) => {
    const style = getComputedStyle(node);
    const width = parseInt(style.width) + parseFloat(style.marginInlineEnd); + parseFloat(style.marginInlineStart);
    return {
      css: (t: number, u: number) => {
        return `margin-inline-start: -${u * width}px; transform: scale(${t});`;
      },
      duration: 100
    }
  }
</script>

<style>

.window {
    position: fixed;
    width: 90%;
    height: 87.5%;
    top: 5%;
    left: 5%;
    background: #fff;
    border-radius: 0.5rem;
    z-index: 100200;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: rgba(0,0,0,0.5) 0 2px 8px 2px;
    overflow: hidden;
  }

  .window-top {
    height: 2.5rem;
    display: flex;
    flex: none;
    box-sizing: border-box;
    align-items: center;
    justify-content: flex-end;
    background: #333;
    cursor: pointer;
  }

  .window-title {
    color: #ddd;
    font-size: 0.9rem;
    margin-inline-end: auto;
    margin-inline-start: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .saving {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .saving-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-inline-start: -0.75rem;
  }

  .window-btn {
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    width: 2.25rem;
    height: 2.25rem;
    margin: 0.125rem;
    border-radius: 0.125rem;
    color: #fff;
  }

  .window-minimize {
    font-size: 0.75rem;
  }

  .window-contents {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  x-metadata {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  x-metadata {
    display: flex;
    flex: none;
    flex-direction: column;
  }

  .label-input {
    position: relative;
    border-bottom: #eee 1px solid;
    display: flex;
    flex-direction: row;
    flex: none;
    min-height: 2em;
    align-items: center;
    padding: 0.25em 0.5em;
    margin: 0 0.5em;
    cursor: text;
  }

  x-label {
    font-size: 0.9rem;
    color: #777;
    align-self: flex-start;
    line-height: 2.5rem;
    height: 2.25rem;
    cursor: default;
    user-select: none;
  }

  .subject {
    font-size: 0.9rem;
    padding: 0 0.5em;
    height: 100%;
    border: 0;
    margin: 0;
    outline: 0;
    flex: 1;
    font-size: inherit;
    font-family: inherit;
  }

  x-toggle-cc {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    font-size: 0.9rem;
    height: 2.75rem;
  }

  x-toggle-cc > span {
    height: 100%;
    display: flex;
    box-sizing: border-box;
    user-select: none;
    align-items: center;
    justify-content: center;
    padding: 0.25em;
    cursor: pointer;
    color: #777;
  }

  x-toggle-cc > span:hover {
    text-decoration: underline;
  }
</style>

<div class="window" in:crossin={{key: current}} out:crossout={{key: current}}>
  <div class="window-top" on:click={onMinimize} on:auxclick={onRemove}>
    <div class="window-title">
      <div class="saving">
        {#if !saved}
          <div class="saving-icon" transition:savingSlide|local>
            <NotSaved />
          </div>
        {/if}
      </div>
      {$locale.New_message}
    </div>
    <div class="btn-light window-btn window-minimize" on:click|stopPropagation={onMinimize}>
      <Minimize />
      <Ripple />
    </div>
    <div class="window-btn window-close btn-light" on:click|stopPropagation={onRemove}>
      <Close />
      <Ripple />
    </div>
  </div>
  <div class="window-contents">
    <x-metadata>
      <label class="label-input" for="compose-to">
        <x-label>{$locale["To:"]}</x-label>
        <AddrInput id="compose-to" name="to" bind:addrs={current.to} />
        <x-toggle-cc>
          {#if !showCc}
            <span on:click|preventDefault={() => {
              current[kShowCc] = true;
              setTimeout(() => cc && cc.focus(), 5)
            }}>{$locale.Cc}</span>
          {/if}
          {#if !showBcc}
            <span on:click|preventDefault={() => {
                current[kShowBcc] = true;
                setTimeout(() => bcc && bcc.focus(), 5);
            }}>{$locale.Bcc}</span>
          {/if}
        </x-toggle-cc>
      </label>
      {#if showCc}
        <label class="label-input" for="compose-cc">
          <x-label>{$locale["Cc:"]}</x-label>
          <AddrInput id="compose-cc" name="cc" bind:addrs={current.cc} bind:input={cc} />
        </label>  
      {/if}
      {#if showBcc}
        <label class="label-input" for="compose-bcc">
          <x-label>{$locale["Bcc:"]}</x-label>
          <AddrInput id="compose-bcc" name="bcc" bind:addrs={current.bcc} bind:input={bcc} />
        </label>  
      {/if}
      <label class="label-input" for="compose-subject">
        <x-label>{$locale["Subject:"]}</x-label>
        <input type="text" name="subject" id="compose-subject" class="subject" autocomplete="off" bind:value={current.subject}>
      </label>
    </x-metadata>
    <Editor bind:draft={current} bind:iframe {onRemove} />
  </div>
</div>