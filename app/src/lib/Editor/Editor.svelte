<script lang="ts" context="module">
  export type EditorContext = {
    cmd: (name: string, value?: any) => boolean
    has: (name: string) => boolean
    any: (...name: string[]) => boolean
    all: (...name: string[]) => boolean 
    _document: Writable<Document | null>
    _window: Writable<Window | null>
  };
</script>

<script lang="ts">
  export let draft: Draft;
  export let onRemove: () => void;

  export let iframe: HTMLIFrameElement;

  import type { Draft } from "$lib/Compose/compose";

  const _document = writable<Document | null>(null);
  const _window = writable<Window | null>(null);
  const has = (cmd: string) => document.queryCommandSupported(cmd);
  const cmd = (key: string, value?: any) => $_document?.execCommand(key, null, value);
  const any = (...cmds: string[]) => cmds.some(c => has(c));
  const all = (...cmds: string[]) => cmds.every(c => has(c));
  
  const context = {
    _document, _window, has, cmd, any, all
  }

  setContext("editor", context);

  import css from "./iframe.css";
  import { setContext } from "svelte";
  import { Writable, writable } from "svelte/store";
  import Bar from "./Bar.svelte";
  
  const contents = (node: HTMLElement) => {
    iframe = document.createElement("iframe");
    iframe.src = "about:blank";

    node.appendChild(iframe);

    const _document = iframe.contentDocument;
    const _window = iframe.contentWindow;

    context._document.set(_document);
    context._window.set(_window);

    _document.documentElement.classList.add("editor-content");

    const style = _document.createElement("style");
    style.textContent = css;
    _document.head.appendChild(style);

    _document.body.contentEditable = "true";
    _document.body.innerHTML = draft.html;
    
    const obs = new MutationObserver(() => {
      draft.html = _document.body.innerHTML;
      draft.text = _document.body.textContent;
    });

    obs.observe(_document.body, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
    });
    

    return {
      destroy: () => {
        node.removeChild(iframe);
        obs.disconnect();
      },
    }
  }
</script>

<style>
  .editor {
    flex: 1;
    display: flex;
    flex-direction: column;  
  }  

  .contents {
    flex: 1;
  }

  .contents > :global(iframe) {
    border: 0;
    padding: 0;
    margin: 0;
    outline: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div class="editor">
  <div class="contents" use:contents>

  </div>
  <div class="bar">
    <Bar bind:draft {onRemove} />
  </div>
</div>