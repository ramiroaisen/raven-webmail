<style>
  x-count {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.6em;
    color: #fff;
    background: var(--pc);
    border-radius: 50%;
    width: 1.4em;
    height: 1.4em;
    line-height: 1.4em;
    text-align: center;
  }

  x-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline-end: 0.5em;
  }

  img {
    flex: none;
    height: 1.5em;
    width: 1.5em;
    margin-inline-end: 1em;
  }
</style>

<script>
  export let mailbox;
  export let message;
  export let attachments;
  export let open = false;

  import Paperclip from "svelte-material-icons/Paperclip.svelte";
  import {Ripple, Menuitem} from "svelte-mui";
  import Menu from "svelte-mui/src/Menu.svelte";
  import {url} from "lib@fileIcons.js";
</script>

<Menu origin="top right">
  <x-action slot="activator" class="btn-dark" data-tooltip="Archivos adjuntos">
    <Paperclip/>
    <Ripple/>
    {#if attachments.length}
      <x-count>{attachments.length}</x-count>
    {/if}
  </x-action>

  {#each attachments as file}
    <Menuitem href="/download/{$mailbox.id}/{$message.id}/{file.id}?filename={encodeURIComponent(file.filename)}" download target="_blank">
      <x-item>
        <img src={url(file.filename)} alt="">
        {file.filename}
      </x-item>
    </Menuitem>
  {/each}
</Menu>