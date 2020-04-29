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
</style>

<script>
  import {Button, Menuitem} from "svelte-mui";
  import Menu from "svelte-mui/src/Menu.svelte";

  export let user;

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l.accountButton;
</script>

<Menu origin="top right" dy={40}>
  <div slot="activator" class="account-button">
    <Button color="#fff">{user.address}</Button>
  </div>
  
  <Menuitem on:click={() => location.replace("/logout")}>{locale.logout}</Menuitem>
</Menu>