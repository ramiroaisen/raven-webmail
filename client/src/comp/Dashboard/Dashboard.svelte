<style>
  x-dashboard {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  x-center {
    flex: 1;
    display: flex;
    flex-direction: row;
  }

  x-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  } 

  x-fab {
    position: fixed;
    z-index: 50;
    right: 2em;
    bottom: 1.5em;
  }

  x-fab > :global(button) {
    background-color: var(--pc) !important;
    color: #fff !important;
  }
</style>

<script>
  import {getContext, setContext} from "svelte";
  import {writable} from "../../lib/store";
  import {derived} from "svelte/store";

  import Topbar from "./Topbar.svelte";
  import Drawer from "./Drawer.svelte";

  import Tabs from "../Compose/Tabs.svelte";

  const drawerOpenMobile = writable(false);
  const drawerOpenDesktop = writable(true);

  const media = matchMedia("screen and (max-width: 768px)")
  const isMobile = writable(media.matches);
  media.onchange = () => { isMobile.set(media.matches) }

  const toggleDrawer = () => {
    if($isMobile) {
      if ($drawerOpenMobile) {
        $drawerOpenMobile = false;
      } else {
        $drawerOpenMobile = true;
        $drawerOpenDesktop = true;
      }
    } else {
      if ( $drawerOpenDesktop ) {
        $drawerOpenDesktop = false;
        $drawerOpenMobile = false;
      } else {
        $drawerOpenDesktop = true;
      }
    }
  }

  import {scale, fade} from "svelte/transition";
  import {quadOut} from "svelte/easing";

  const custom = (node, {duration = 400}) => {
    return {
      duration,
      easing: quadOut,
      css: (t, u) => `\
        transform: scale(${0.95 + t * 0.05});\
        opacity: ${t};\
        `
    }
  }

  const {page} = getContext("router");
  const hasDrawer = derived(page, page => page.path !== "/login");
  console.log("hasDrawer", $hasDrawer)

  setContext("dash", {toggleDrawer, isMobile, drawerOpenMobile, drawerOpenDesktop, hasDrawer});

  import {Button, Icon} from "svelte-mui";
  import Compose from "svelte-material-icons/EmailEditOutline.svelte";
  import {create} from "comp@Compose/compose.js";
  import {createDraft} from "lib@client/messages.js"; 
</script>

<x-dashboard in:fade={{duration: 300}}>
  <Topbar />
  <x-center>
    <Drawer />
    <x-main>
      <slot />
    </x-main>
  </x-center>
</x-dashboard>

<Tabs/>

{#if $page.path !== "/login"}
  <x-fab transition:scale={{duration: 400}} on:click={async () => create()}>
    <Button icon fab>
      <Icon>
        <Compose />
      </Icon>
    </Button>
  </x-fab>
{/if}