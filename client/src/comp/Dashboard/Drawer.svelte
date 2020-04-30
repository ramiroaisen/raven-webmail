<style>

  x-drawer {
    transition: box-shadow 200ms ease, margin 200ms ease;
    width: 15em;
    background: #fff;
    flex: none;
    overflow-x: hidden;
    overflow-y: auto;
  }

  x-overlay {
    visibility: hidden;
  }

  @media not all and (max-width: 768px) {
    x-drawer {
      margin-inline-start: -15em;
    }

    x-drawer.desktop-open {
      border-inline-end: var(--border-gray) 1px solid;
      margin-inline-start: 0;
    }

    .title {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    
    .menu {
      font-size: 1.25em;
    }

    .title {
      border-bottom: var(--border-gray) 1px solid;
      flex: none;
      height: var(--topbar-height);
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: default;
      user-select: none;
    }

    .label {
      font-size: 1.4em;
      font-weight: 600;
    }

    x-drawer {
      margin-inline-start: 0;
      position: fixed;
      z-index: 101;
      height: 100%;
      left: 0;
      top: 0;
      margin-inline-start: -15em;
    } 

    x-drawer.mobile-open {
      margin-inline-start: 0;
      box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
    }

    x-overlay {
      visibility: visible;
    }
  }
</style>

<script>
  import {getContext} from "svelte";
  import {fade} from "svelte/transition";
  import MailboxList from "./MailboxList/MailboxList.svelte";
  import MenuButton from "./MenuButton.svelte";
  import Menu from "svelte-material-icons/Menu.svelte";

  const {hasDrawer, toggleDrawer, isMobile, drawerOpenMobile, drawerOpenDesktop} = getContext("dash");
</script>

{#if $hasDrawer}
  {#if $drawerOpenMobile}
    <x-overlay transition:fade={{duration: 300}} on:click={() => drawerOpenMobile.set(false)} />
  {/if}

  <x-drawer class:mobile-open={$drawerOpenMobile} class:desktop-open={$drawerOpenDesktop}>
    <div class="title">
      <MenuButton dark />
      <span class="label">
        Raven
      </span>
    </div>
    <MailboxList />
  </x-drawer>
{/if}
