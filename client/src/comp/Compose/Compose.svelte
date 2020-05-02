<style>
  x-popup {
    position: fixed;
    z-index: 200;
    height: 90%;
    width: 90%;
    top: 5%;
    left: 5%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);
    border-radius: 0.5em 0.5em  0.25em 0.25em;
  }

  x-topbar {
    border-radius: 0.5em 0.5em 0 0;
    background-color: #404040;
    flex: none;
    height: 2.5rem;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    cursor: pointer;
  }

  x-topbar-button {
    display: flex;
    flex: none;
    height: 2rem;
    width: 2rem;
    margin-inline-end: 0.25rem;
    font-size: 1.25em;
    cursor: pointer;
    color: rgba(255,255,255,0.75);
    align-items: center;
    justify-content: center;
    transition: background-color 150ms ease, color 150ms ease;
    border-radius: 0.25rem;
    user-select: none;
  }

  x-topbar-button.min {
    font-size: 0.8em;
  }

  x-topbar-button:hover{
    background: rgba(255,255,255,0.15);
    color: #fff;
  }

  x-topbar-button:active{
    background: rgba(255,255,255,0.25);
    color: #fff;
  }

  x-compose {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    position: relative;
  }

  x-send {
    position: absolute;
    display: flex;
    white-space: nowrap;
    right: 1.2em;
    bottom: 1.2em;
    color: #fff;
    background-color: #1a73e8;
    font-weight: 600;
    border-radius: 0.25em;
    overflow: hidden;
    user-select: none;
    cursor: pointer;
    transition: box-shadow 200ms ease;
  }

  x-send:hover {
    box-shadow: 0 1px 2px 0 rgba(26,115,232,0.451), 0 1px 3px 1px rgba(26,115,232,0.302);
  }

  x-send > span {
    padding: 0.6em 1.15em;
    border: 1px solid rgba(0,0,0,0.2);
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
    color: #777;
    align-self: flex-start;
    line-height: 2.25em;
    height: 2.25em;
    cursor: default;
    user-select: none;
  }

  input {
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
    right: 0.5em;
    top: 0.5em;
    display: flex;
    flex-direction: row;
    align-items: center; 
  }

  x-toggle-cc > span {
    padding: 0.25em;
    cursor: pointer;
    color: #777;
  }

  x-toggle-cc > span:hover {
    text-decoration: underline;
  }

  x-quill {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
  }

  x-editor {
    flex: 1;
    border: none !important;
  }

  :global(.ql-editor) {
    flex: 1;
    font-size: 15px;
    padding: 1rem 1.5rem !important; 
    border: none;
  }

  :global(.ql-editor::-webkit-scrollbar) {
    width: 0.6rem;
    height: 0.6rem;
    cursor: default;
  }

  :global(.ql-editor::-webkit-scrollbar-button) {
    width: 0;
    height: 0;
    display: none;
  }

  :global(.ql-editor::-webkit-scrollbar-corner) {
    background-color: transparent;
  }

  :global(.ql-editor::-webkit-scrollbar-thumb) {
    background-color: rgba(0,0,0,0.2);
    box-shadow: inset 1px 1px 0 rgba(0,0,0,0.10), inset 0 -1px 0 rgba(0,0,0,0.07);
  }

  :global(.ql-toolbar) {
    font-family: sans-serif !important;
    flex: none;
    margin: 1em;
    margin-right: 7.45em;
    border-radius: 3px;
    background: #fff !important;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-self: start;
    z-index: 1;
    padding: 0.25em;
  }

  :global(.ql-formats) {
    margin: 0.25em 0 !important;
  }

  :global(.ql-formats:not(:last-child)) {
    margin-inline-end: 0.5em !important;
  }

  :global(.ql-snow .ql-picker.ql-expanded .ql-picker-options) {
    top: 0 !important;
    transform: translate(0, -100%);
  }

  :global(polygon.ql-stroke:first-child) {
    transform: translate(0, -0.2em);
   }

   :global(polygon.ql-stroke:last-child) {
    display: none;
   }

   x-send-button {
     position: absolute;
     bottom: 1em;
     right: 1em;
     font-weight: 600;
   }

   x-center {
     flex: 1;
     display: flex;
     align-content: stretch;
     justify-content: stretch;
   }
</style>

<script>
  import {sanitize} from "../../lib/sanitize"; 

  import { onMount, onDestroy, setContext } from "svelte";
  import { fade } from "svelte/transition";

  import Close from "svelte-material-icons/WindowClose.svelte";
  import Minimize from "svelte-material-icons/ColorHelper.svelte";

  import AddrInput from "./AddrInput.svelte";

  import deepClone from "clone-deep";
  import deepEqual from "deep-equal";
  //import deepDiff from "deep-diff";

  import {current, wins, send, receive} from "./compose";

  import {createPostableDraft} from "lib@client/messages.js";

  export let self;
  setContext("compose", {key: self})

  //let html = sanitize($self.html);
  //let saved = clone($self);
  //saved.html = 

  let saved = createPostableDraft($self);
  export let saving = false;

  let ms = 3000;
  let timer;
  
  const saveIf = async () => {
    let current = createPostableDraft($self);
    if (!deepEqual(saved, current)) {
      saving = true;
      const id = await saveDraft($self);
      $self.id = id;
      saved = current;
      saving = false;
    }
  }

  onMount(async () => {

    if(!$self.id) {
      $self.id = await saveDraft($self);
    }

    timer = setTimeout(function fn(){
      saveIf();
      timer = setTimeout(fn, ms);
    }, ms);
  })

  onDestroy(() => {
    clearTimeout(timer);
    saveIf();
  })

  export let showCc = !!$self.cc.length;
  export let showBcc = !!$self.bcc.length;
  let cc, bcc; // DOM
  let editor; // Component 

  export const minimize = () => current.set(null);

  export let close = () => {
    wins.update(w => w.filter(w => w !== self));
    current.set(null);
  }

  import Editor from "../Editor/Editor.svelte";
  import {getNotifier} from "comp@Notify/notify.js";
  import {submitDraft, saveDraft} from "lib@client/messages.js";


  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l;

  let sending = false;

  const sendMessage = async () => {
    if(sending)
      return;

    sending = true;

    try {
      await submitDraft($self.id);
      getNotifier().add({variant: "success", text: locale.notifier.messageSent});
      close();
    } catch(e) {
      getNotifier().add({variant: "error", text: e.message});
    } finally {
      sending = false;
    }
  }

</script>

{#if self === $current}

  <x-popup in:receive={{key: self}} out:send={{key: self}} >
    <x-topbar on:click={minimize}>
      <x-topbar-button on:click|stopPropagation={close}>
        <Close />
      </x-topbar-button>
      <x-topbar-button class="min" on:click|stopPropagation={minimize}>
        <Minimize />
      </x-topbar-button>
    </x-topbar>
    
    <x-compose>
      
      <x-metadata>
        <label class="label-input">
          <x-label>{locale.compose.labels.to}</x-label>
          <AddrInput name="to" bind:addrs={$self.to} />
          <x-toggle-cc>
            {#if !showCc}
              <span on:click|preventDefault={() => {
                showCc = true;
                setTimeout(() => {
                  cc && cc.focus()
                }, 1)
              }}>{locale.compose.labels.cc}</span>
            {/if}
            {#if !showBcc}
              <span on:click|preventDefault={() => {
                  showBcc = true;
                  setTimeout(() => {
                    bcc && bcc.focus()
                  }, 1)
              }}>{locale.compose.labels.bcc}</span>
            {/if}
          </x-toggle-cc>
        </label>
        {#if showCc}
          <label class="label-input">
            <x-label>{locale.compose.labels.cc}</x-label>
            <AddrInput name="cc" bind:addrs={$self.cc} bind:input={cc} />
          </label>  
        {/if}
        {#if showBcc}
          <label class="label-input">
            <x-label>{locale.compose.labels.bcc}</x-label>
            <AddrInput name="bcc" bind:addrs={$self.bcc} bind:input={bcc} />
          </label>  
        {/if}
        <label class="label-input" for="subject">
          <x-label>{locale.labels.subject}</x-label>
          <input type="text" name="subject" id="subject" autocomplete="off" bind:value={$self.subject}>
        </label>
      </x-metadata>
      
      <x-center>
        <Editor
          locale={locale.editor}
          bind:this={editor}
          bind:html={$self.html}
          bind:text={$self.text}
          {sending}
          on:send={sendMessage}
          bind:files={$self.files}
        />
      </x-center>

    </x-compose>
  </x-popup>
{/if}