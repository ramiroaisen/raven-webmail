<style>
  .account-button {
    position: relative;
    display: flex;
    z-index: 100;
    flex: none;
  }

  .anchor {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .button{
    letter-spacing: 0.75px;
    font-weight: 500;
    padding: 0.65em 1em;
    display: flex;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    border-radius: 0.25em;
  }
</style>

<script>
  export let user;

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l.accountButton;

  import Account from "svelte-material-icons/AccountEditOutline.svelte";
  import Logout from "svelte-material-icons/Logout.svelte";
  import Filters from "svelte-material-icons/FilterOutline.svelte";

  import {Ripple} from "svelte-mui";
  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte";
  import MenuItem from "comp@Menu/MenuItem.svelte";

  export let menuOpen = false;
  const toggle = () => menuOpen = !menuOpen;
</script>

<div class="account-button">
  <div class="button btn-light" class:hover={menuOpen} on:click={toggle}>
    {user.address}
    <Ripple />
  </div>
  <div class="anchor">
      <Popup anchor="top-right" bind:open={menuOpen} >
        <Menu>
          <MenuItem href="#!/account" icon={Account}>
            {locale.myAccount}
          </MenuItem>

          <MenuItem href="#!/filters" icon={Filters}>
            {locale.filters}
          </MenuItem>

          <MenuItem on:click={() => location.replace("/logout")} icon={Logout}>
            {locale.logout}
          </MenuItem>
        </Menu>
      </Popup>
  </div>
</div>