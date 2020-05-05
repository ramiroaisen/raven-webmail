<style>
  .account-button :global(button){
    text-transform: none !important;
    font-size: 1em !important;
    line-height: 1em !important;
    height: 2.5em !important;
    padding: 0 1em !important;
    display: flex !important;
    align-content: center !important;
    justify-content: center !important;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 10em;
  }

  .item > :global(svg) {
    width: 1.5em;
    height: 1.5em;
    flex: none;
    margin-inline-end: 0.5em;
  }
</style>

<script>
  import {Button, Menuitem} from "svelte-mui";
  import Menu from "svelte-mui/src/Menu.svelte";

  export let user;

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l.accountButton;

  import Account from "svelte-material-icons/AccountEditOutline.svelte";
  import Logout from "svelte-material-icons/Logout.svelte";

</script>

<Menu origin="top right" dy={40}>
  <div slot="activator" class="account-button">
    <Button color="#fff">{user.address}</Button>
  </div>

  <Menuitem href="#!/account">
    <div class="item">
      <Account />
      {locale.myAccount}
    </div>
  </Menuitem>
  <Menuitem on:click={() => location.replace("/logout")}>
    <div class="item">
      <Logout />
      {locale.logout}
    </div>
  </Menuitem>
</Menu>