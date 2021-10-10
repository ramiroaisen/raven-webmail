<script lang="ts">
  export let username: string;
  import { page } from "$app/stores";
  let q = ($page.path === "/search" && $page.query.get("query")) || "";

  import Menu from "svelte-material-icons/Menu.svelte";
  import AccountButton from "./AccountButton.svelte";

  import { getContext } from "svelte";
  import type { DashContext } from "./Dashboard.svelte";
  import Ripple from "$lib/Ripple.svelte";
  const { toggle } = getContext("dash") as DashContext;

  import Magnify from "svelte-material-icons/Magnify.svelte";
  import { goto } from "$app/navigation";
  import { locale } from "$lib/locale";

  let searching = false;
  const onkeypress = async (event: KeyboardEvent) => {
    if(event.key === "Enter") {
      let _q = q.trim();
      if(_q) {
        try {
          await goto(`/search?query=${encodeURIComponent(_q)}`, { keepfocus: true, replaceState: location.pathname === "/search" })
        } finally {
          searching = false;
        }
      }
    }
  }
</script>

<style>
  .top {
    height: var(--top-h);
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: none;
    background: var(--red);
  }

  .menu {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    flex: none;
    border-radius: 0;
    padding: 0;
  }

  .logo {
    font-weight: 500;
    font-size: 1.25rem;
    margin-inline-end: 1rem;
  }

  @media screen and (max-width: 600px) {
    .logo {
      display: none;
    }
  }

  .q-wrap-wrap {
    margin-inline-end: 0.75rem;
    display: flex;
    flex: 1;
    flex-basis: 14rem;
  }

  .q-wrap {
    flex: 1;
    position: relative;
    display: flex;
    max-width: 45rem;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.65rem;
    display: flex;
    font-size: 1.25rem;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.8);
    margin-inline-end: 1rem;
  }

  .q {
    display: block;
    flex: 1;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border-radius: 100px;
    border: 0;
    outline: 0;
    font: inherit;
    background: rgba(255,255,255,0.25);
    font-size: 0.95rem;
    color: #fff;
  }

  .q::placeholder {
    color: rgba(255,255,255,0.8);
  }
</style>

<div class="top">
  <div class="menu btn-light" on:click={toggle}>
    <Menu />
    <Ripple />
  </div>
  <div class="logo">{$locale.Raven}</div>
  <div class="q-wrap-wrap">
    <div class="q-wrap">
      <div class="search-icon">
        <Magnify />
      </div>
      <input type="text" on:keypress={onkeypress} class="q" placeholder={$locale["Search..."]} bind:value={q} />
    </div>
  </div>
  <AccountButton {username} />
</div>