<style>
  x-topbar {
    height: var(--topbar-height);
    display: flex;
    flex-direction: row;
    align-items: center;
    background: var(--pc);
    color: #fff;
    position: relative;
    /*z-index: 100;*/
  }

  x-logo {
    font-weight: 600;
    font-size: 1.4em;
  }

  .account-button {
    margin-inline-start: auto;
    margin-inline-end: 0.5em;
  }
</style>

<script>
  import {getContext} from "svelte";

  const {toggleDrawer, hasDrawer} = getContext("dash");

  import {user} from "../../lib/client/client";

  import MenuButton from "./MenuButton.svelte";
  import AccountButton from "./AccountButton.svelte";
  import Menu from "svelte-material-icons/Menu.svelte";
  import Close from "svelte-material-icons/Close.svelte";
</script>

<x-topbar>
  <MenuButton light hidden={!$hasDrawer} />
  <x-logo>Raven Webmail</x-logo>
  {#if $user}
    <div class="account-button">
      <AccountButton user={$user} dark />
    </div>
  {/if}
</x-topbar>