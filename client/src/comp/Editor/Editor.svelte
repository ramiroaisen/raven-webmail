<style>
  x-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    --tooltip-bg: rgba(0,0,0,0.8);
  }

  x-editable {
    overflow: auto;
    flex: 1;
    padding: 1em 1.5em;
    font-family: sans-serif;
  }

  x-editable::-webkit-scrollbar {
    width: 0.6rem;
    height: 0.6rem;
    cursor: default;
  }

  x-editable::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }

  x-editable::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  x-editable::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.2);
    box-shadow: inset 1px 1px 0 rgba(0,0,0,0.10), inset 0 -1px 0 rgba(0,0,0,0.07);
  }

  x-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
  }

  x-toolbar {
    display: flex;
    flex-direction: row;
    padding: 0.5em;
    border-radius: 3px;
    align-items: center;
    justify-self: flex-start;
    flex-wrap: wrap;
    margin-inline-end: 1em;
  }

  x-toolbar :global(x-command-group) {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 0 0.25em;
    flex: none;
  }

  x-toolbar :global(x-command) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1em;
    user-select: none;
    cursor: pointer;
    color: #444;
    transition: background-color 300ms ease, color 300ms ease;
    border-radius: 3px;
    position: relative;
    flex: none;
  }

  x-toolbar :global(x-command:hover) {
    color: #111;
    background-color: rgba(0,0,0,0.15);
  }

  x-toolbar :global(x-command:active) {
    background-color: rgba(0,0,0,0.25);
  }

  x-toolbar :global(x-command.multiple:after) {
    content: "▼";
    transform: scaleY(0.6); 
    font-size: 0.8em;
  }

  /*
  x-toolbar :global(x-command-group + x-command-group) {
    border-inline-start: rgba(0,0,0,0.1) 1px solid;
  }
  */

  x-toolbar :global(x-command-group:empty) {
    display: none;
  }

  x-toolbar :global(x-command > svg) {
    font-size: 1.4em;
  }

  x-end {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: auto;
  }

  x-send {
    min-width: auto;
    margin-inline-start: 1em;
  }
</style>

<script>
  import {setContext, createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();

  export let html = "";
  export let text = "";
  export let sending = false;
  export let files;

  const has = (cmd) => document.queryCommandSupported(cmd);
  const cmd = (key, value) => document.execCommand(key, null, value);
  const any = (...cmds) => cmds.some(c => has(c));
  const all = (...cmds) => cmds.every(c => has(c));
  
  setContext("editor", {has, cmd, any, all});

  import Bold from "svelte-material-icons/FormatBold.svelte";
  import Underline from "svelte-material-icons/FormatUnderline.svelte";
  import Italic from "svelte-material-icons/FormatItalic.svelte";
  import JustifyLeft from "svelte-material-icons/FormatAlignLeft.svelte";
  import JustifyRight from "svelte-material-icons/FormatAlignRight.svelte";
  import JustifyCenter from "svelte-material-icons/FormatAlignCenter.svelte";
  import ListBulleted from "svelte-material-icons/FormatListBulleted.svelte";
  import ListNumbered from "svelte-material-icons/FormatListNumbered.svelte";
  import Undo from "svelte-material-icons/Undo.svelte";
  import Redo from "svelte-material-icons/Redo.svelte";
  import Quote from "svelte-material-icons/FormatQuoteClose.svelte";
  import Size from "svelte-material-icons/FormatSize.svelte";
  import RemoveFormat from "svelte-material-icons/FormatClear.svelte";

  import FontSize from "./FontSize.svelte";
  import FontFamily from "./FontFamily.svelte";
  import Color from "./Color.svelte";
  import Upload from "../Upload/Upload.svelte";

  //import {Button} from "svelte-mui";
  import {getNotifier} from "comp@Notify/notify.js";
  import ProgressButton from "comp@ProgressButton.svelte";
</script>

<x-editor>
  <x-editable contenteditable bind:textContent={text} bind:innerHTML={html}>
  </x-editable>
  <x-bar>
    <x-toolbar class="elevation-4">

      {#if all("undo", "redo")}
      <x-command-group>
        <x-command data-tooltip="Deshacer (Ctrl+Z)" on:click={() => cmd("undo")}>
          <Undo />
        </x-command>
        <x-command data-tooltip="Rehacer (Ctrl+Y)" on:click={() => cmd("redo")}>
          <Redo />
        </x-command>
      </x-command-group>
      {/if}

      {#if has("fontName")}
        <x-command-group>
          <FontFamily />
        </x-command-group>
      {/if}

      {#if has("fontSize")}
        <x-command-group>
          <FontSize />
        </x-command-group>
      {/if}
      
      {#if any("bold", "italic", "underline")}
        <x-command-group>
          {#if has("bold")}
            <x-command data-tooltip="Negrita (Ctrl+B)" on:click={() => cmd("bold")}>
              <Bold />
            </x-command>
          {/if}

          {#if has("italic")}
            <x-command data-tooltip="Itálica (Ctrl+I)" on:click={() => cmd("italic")}>
              <Italic />
            </x-command>
          {/if}

          {#if has("underline")}
            <x-command data-tooltip="Subrayado (Ctrl+U)" on:click={() => cmd("underline")}>
              <Underline />
            </x-command>
          {/if}
        </x-command-group>
      {/if}

      {#if any("foreColor", "backColor")}
        <Color />
      {/if}

      {#if any("justifyLeft", "justifyCenter", "justifyRight")}
        <x-command-group>
          {#if has("justifyLeft")}
            <x-command data-tooltip="Alinear a la izquierda" on:click={() => cmd("justifyLeft")}>
              <JustifyLeft />
            </x-command>
          {/if}
          {#if has("justifyCenter")}
            <x-command data-tooltip="Alinear al centro" on:click={() => cmd("justifyCenter")}>
              <JustifyCenter />
            </x-command>
          {/if}
          {#if has("justifyRight")}
            <x-command data-tooltip="Alinear a la derecha" on:click={() => cmd("justifyRight")}>
              <JustifyRight />
            </x-command>
          {/if}
        </x-command-group>
      {/if}

      {#if any("insertUnorderedList", "insertOrderedList")}
        <x-command-group>
          {#if has("insertUnorderedList")}
            <x-command data-tooltip="Lista con viñetas" on:click={() => cmd("insertUnorderedList")}>
              <ListBulleted />
            </x-command>
          {/if}
          {#if has("insertOrderedList")}
            <x-command data-tooltip="Lista numerada" on:click={() => cmd("insertOrderedList")}>
              <ListNumbered />
            </x-command>
          {/if}
        </x-command-group>
      {/if}

      {#if has("removeFormat")}
        <x-command-group>
          <x-command data-tooltip="Borrar formato" on:click={() => cmd("removeFormat")}>
            <RemoveFormat />
          </x-command>
        </x-command-group>
      {/if}
    </x-toolbar>
  
    <x-end>
      <Upload bind:files/>
      <x-send>
        <ProgressButton color="#4273e8" progress={{size: "1.5em"}} raised inprogress={sending} on:click={() => dispatch("send")}>
          <span style="text-transform: none; font-size:1.1em">Enviar</span>
        </ProgressButton>
      </x-send>
    </x-end>
  </x-bar>
</x-editor>