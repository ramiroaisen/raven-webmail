<style>
  .anchor {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<script>
  import {getContext} from "svelte";
  const {cmd} = getContext("editor");

  import FontFamily from "svelte-material-icons/FormatFont.svelte";

  export let tooltip;
  export let open = false;
  const toggle = () => open = !open;

  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte"
  import MenuItem from "comp@Menu/MenuItem.svelte"
</script>

<x-command class="multiple" class:hover={open} data-tooltip={open ? null : tooltip} on:click={toggle}>
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
