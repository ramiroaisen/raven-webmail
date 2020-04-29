<style>
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.25em 0 0.25em 0.25em;
    background: #fff;
    /*
    background-color: transparent;
    transition: background-color 200ms ease;
    */
  }

  .current:after {
    background-color: rgba(var(--pc-rgb), 0.15);
  }

  .icon {
    display: flex;
    padding: 0.5em;
    font-size: 1.25em;
  }

  .label {}

  .count {
    margin-inline-start: auto;
    font-size: 0.85em;
    margin-inline-end: 1em;
  }
</style>

<script>
  import {getContext} from "svelte";
  import {scale} from "svelte/transition";

  import {mailboxMeta} from "../../../lib/util";
  export let mailbox;
  
  import {Ripple} from "svelte-mui";
  
  const {page} = getContext("router");

  const {drawerOpenMobile} = getContext("dash")

  const {locale} = getContext("app");

  let current, meta;
  $: current = $page.params.mailbox === $mailbox.id;
  $: meta = mailboxMeta($mailbox, $locale.mailbox.title);
</script>

<a href="#!/mailbox/{$mailbox.id}" class="na btn-dark" class:current on:click={() => $drawerOpenMobile.set(false)}>
  <span class="icon">
    <svelte:component this={meta.icon} />
  </span>
  <span class="label">{meta.label}</span>
  {#if $mailbox.unseen}
    <span transition:scale={{duration: 200}} class="count">{$mailbox.unseen}</span>
  {/if}
  <Ripple />
</a>