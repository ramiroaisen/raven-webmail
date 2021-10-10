<style>
  .anchor {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<script lang="ts">

  export let label: string;
  export let open = false;
  const toggle = () => open = !open;

  import { getContext } from "svelte";
  import type { EditorContext } from "./Editor.svelte";
  const { cmd } = getContext("editor") as EditorContext;

  import FontFamily from "svelte-material-icons/FormatFont.svelte";

  import Popup from "$lib/PortalPopup.svelte";
  import Menu from "$lib/Menu/Menu.svelte"
  import MenuItem from "$lib/Menu/MenuItem.svelte"
  import { tooltip } from "$lib/actions";
</script>

<x-command class="multiple" class:hover={open} use:tooltip={open ? null : label} on:click={toggle}>
  <FontFamily />
  <div class="anchor">
    <Popup anchor="bottom-left" bind:open>
      <Menu>
        <MenuItem on:click={() => cmd("fontName", "sans-serif")} iconPlaceholder={false}>
          <span style="font-family: sans-serif">Sans Serif</span>
        </MenuItem>
        <MenuItem on:click={() => cmd("fontName", "serif")} iconPlaceholder={false}>
          <span style="font-family: serif">Serif</span>
        </MenuItem>
        <MenuItem on:click={() => cmd("fontName", "monospace")} iconPlaceholder={false}>
          <span style="font-family: monospace">Monospace</span>
        </MenuItem>
      </Menu>
    </Popup>
  </div>
</x-command>
