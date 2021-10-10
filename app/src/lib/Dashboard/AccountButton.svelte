<script lang="ts">
  import { goto } from "$app/navigation";
  export let username: string;
  export let open = false;

  import Menu from "$lib/Menu/Menu.svelte";
  import MenuItem from "$lib/Menu/MenuItem.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { action, _post } from "$lib/util";
  import SignOut from "svelte-material-icons/Logout.svelte";
  import Account from "svelte-material-icons/AccountEditOutline.svelte";
  import PortalPopup from "$lib/PortalPopup.svelte";
import { locale } from "$lib/locale";
  
  const signOut = action(async () => {
    await _post("/api/logout", {})
    goto("/login");
  })
</script>

<style>
  .wrap {
    position: relative;
    margin-inline-start: auto;
    margin-inline-end: 1rem;
  }

  .anchor {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .account-btn {
    font-size: 0.9rem;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: var(--btn-padding);
    border-radius: var(--btn-radius);
  }
</style>

<div class="wrap">
  <div class="btn-dark account-btn" class:hover={open} on:click={() => open = !open}>
    {username}
    <Ripple />
  </div>
  
  <div class="anchor">
    <PortalPopup anchor="top-right" bind:open>
      <Menu>
        <MenuItem icon={Account} href="/me">{$locale.My_account}</MenuItem>
        <MenuItem icon={SignOut} on:click={signOut}>{$locale.Sign_out}</MenuItem>
      </Menu>
    </PortalPopup>
  </div>
</div>