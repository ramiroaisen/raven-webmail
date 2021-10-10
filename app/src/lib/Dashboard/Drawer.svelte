<script lang="ts" context="module">
  export type DrawerContext = {
    scrollTop: Writable<number>
  };
</script>

<script lang="ts">
  const { mailboxes, reloadMailboxes, drawerOpen: { wide, narrow } } = getContext("dash") as DashContext;

  const scrollTop = writable(0);
  setContext("drawer", { scrollTop })

  const onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    $scrollTop = target.scrollTop;
  }

  import DrawerMailbox from './DrawerMailbox.svelte';
  import ComposeIcon from "svelte-material-icons/EmailEditOutline.svelte";
  import Ripple from "$lib/Ripple.svelte";

  const compose = action(async () => {
    await _blank($mailboxes.find(isDrafts)!);
  })

  import { circInOut } from "svelte/easing";

  const custom = (node: HTMLElement, { duration = 400 }) => {
    const width = node.clientWidth;
    return () => {
      return {
        duration,
        easing: circInOut,
        css: (t: number, u: number) => `margin-inline-start: -${u * width}px`,
      }      
    }
  }

  import Menu from "svelte-material-icons/Menu.svelte"; 

  import { action, isDrafts, isNarrow, _post } from "$lib/util";
  import type { DashContext } from "./Dashboard.svelte";
  import { getContext, setContext } from "svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import Dialog from "$lib/Dialog.svelte";
  import Formy from "$lib/Formy/Formy.svelte";
  import TextField from "$lib/TextField.svelte";
  import { Writable, writable } from "svelte/store";
  import { _blank } from '$lib/Compose/compose';
  import { _message } from '$lib/Notify/notify';
  import { locale } from '$lib/locale';

  let createOpen = false;
  let createName = "";
  const openCreate = () => createOpen = true;

  const createFolder = action(async () => {
    await _post("/api/mailboxes", { path: createName })
    createOpen = false;
    _message($locale.notifier.New_folder_created);
    await reloadMailboxes();
  })
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.4);
    z-index: 101100;
    transition: opacity 300ms ease;
  }

  .overlay:not(.open) {
    opacity: 0;
    pointer-events: none;
  }

  .drawer {
    --drawer-w: 15rem;
    box-sizing: border-box;
    width: var(--drawer-w);
    flex: none;
    border-right: var(--border) 1px solid;
    align-self: stretch;
    min-height: 0;
    display: flex;
    flex-direction: column;
    transition: margin 300ms ease;
  }

  @media (max-width: 800px) {
    .drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 101200;
    }

    .drawer:not(.narrow-open) {
      margin-inline-start: calc(-1 * var(--drawer-w));
    }
  }

  @media not all and (max-width: 800px) {
    .drawer:not(.wide-open) {
      margin-inline-start: calc(-1 * var(--drawer-w));
    }
  }

  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    color: #111;
    height: var(--top-h);
    margin-bottom: -0.75rem;
  }

  .menu {
    display: flex;
    flex: none;
    height: var(--top-h);
    width: var(--top-h);
    font-size: 1.75rem;
    align-items: center;
    justify-content: center;
  }

  .logo {
    font-weight: 500;
    font-size: 1.25rem;
  }

  .drawer {
    background: #fff;
  }

  .compose-wrap {
    z-index: 10;
    position: relative;
    padding: 1rem;
    transition: box-shadow 200ms ease;
  }

  .compose-wrap.scrolled {
    box-shadow: rgba(0,0,0,0.25) 0 2px 4px 0; 
  }

  .scroll {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .compose {
    display: flex;
    align-items: center;
    border: var(--border) 1px solid;
    border-radius: 100px;
    padding: 0.75rem 1.25rem 0.75rem 0.75rem;
    font-size: 1rem;
    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%);
    transition: box-shadow 400ms ease;
    user-select: none;
    cursor: pointer;
    --ripple-color: rgba(0,0,0,0.2);
    background: #fff;
  }

  .compose:hover {
    box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)
  }

  .compose-icon {
    display: flex;
    font-size: 1.25rem;
    margin-inline-end: 0.75rem;
    margin-inline-start: 0.25rem;
  }

  .sep {
    border-top: var(--border) 1px solid;
  }

  .new {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 0.75rem 1rem 0.5rem;
  }

  .new-icon {
    font-size: 1.25rem;
    margin-inline-end: 1rem;
  }

  .create-form {
    display: flex;
    flex-direction: column;
  }

  .create-name {
    margin-bottom: 1.25rem;
  }

  .create-send {
    align-self: flex-end;
  }
</style>

  <div class="overlay only-narrow" class:open={$narrow}  
    on:click={() => isNarrow() ? narrow.set(false) : wide.set(false)}
  />

<div class="drawer" class:narrow-open={$narrow} class:wide-open={$wide}>
  
  <div class="top only-narrow">
    <div class="menu btn-dark" on:click={() => narrow.set(false)}>
      <Menu />
      <Ripple />
    </div>
    <div class="logo">
      {$locale.Raven}
    </div>
  </div>

  <div class="compose-wrap" class:scrolled={$scrollTop !== 0}>
    <button class="compose" on:click={() => { narrow.set(false); compose(); }}>
      <div class="compose-icon">
        <ComposeIcon />
      </div>
      {$locale.Compose}
      <Ripple />
    </button>
  </div>

  <div class="scroll thin-scroll" on:scroll={onScroll}>
    <div class="mailboxes">
      {#each $mailboxes as mailbox (mailbox.id)}
        <DrawerMailbox {mailbox} />
      {/each}
    </div>

    <div class="sep"></div>

    <div class="new btn-dark" on:click={openCreate}>
      <div class="new-icon">
        <Plus />
      </div>
      {$locale.Create_new_folder}
      <Ripple />
    </div>
  </div>

</div>

{#if createOpen}
  <Dialog title={$locale.Create_new_folder} width="500px" onClose={() => createOpen = false}>
    <Formy action={createFolder} let:submit>
      <form class="create-form" on:submit|preventDefault={submit}>
        <div class="create-name"> 
          <TextField validate required trim label={$locale.Folder_name} bind:value={createName} />
        </div>
        <button type="submit" class="create-send elev2 btn-light btn-primary">
          {$locale.Create}
          <Ripple />
        </button>
      </form>
    </Formy>
  </Dialog>
{/if}