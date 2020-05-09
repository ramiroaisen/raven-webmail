<style>
  .anchor {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 1rem;
  }

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

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  img {
    flex: none;
    height: 1.5em;
    width: 1.5em;
    margin-inline-end: 1em;
    pointer-events: none;
    position: absolute;
    left: 0.5em;
    top: calc(50% - 0.75em);
  }
</style>

<script>
  export let mailbox;
  export let message;
  export let attachments;

  import Paperclip from "svelte-material-icons/Paperclip.svelte";
  import {Ripple} from "svelte-mui";
  import {url} from "lib@fileIcons.js";

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l;

  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte";
  import MenuItem from "comp@Menu/MenuItem.svelte";

  export let menuOpen = false;
  const toggle = () => menuOpen = !menuOpen;
</script>

  <x-action class="btn-dark" class:hover={menuOpen} data-tooltip={locale.actions.attachments} on:click={toggle}>
    <Paperclip/>
    <Ripple/>
    {#if attachments.length}
      <x-count>{attachments.length}</x-count>
    {/if}
    <div class="anchor">
      <Popup anchor="top-left" bind:open={menuOpen}>
        <Menu>
          {#each attachments as file}
            <div class="item">
              <MenuItem href="/download/{$mailbox.id}/{$message.id}/{file.id}?filename={encodeURIComponent(file.filename)}" target="_blank">
                {file.filename}
              </MenuItem>
              <img src={url(file.filename)} alt="">
            </div>
          {/each}
        </Menu>
      </Popup>
    </div>
  </x-action>