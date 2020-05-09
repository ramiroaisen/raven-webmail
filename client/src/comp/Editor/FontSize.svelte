<style>
  .anchor {
    position: absolute;
    top: 0;
    left: 0;
  }

  .size {
    display: flex;
    align-items: center;
  }
</style>

<script>

  export let tooltip;

  import Size from "svelte-material-icons/FormatSize.svelte";

  export let open = false;
  const toggle = () => open = !open;

  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte"
  import MenuItem from "comp@Menu/MenuItem.svelte"
</script>


<x-command class="multiple" class:hover={open} data-tooltip={open ? null : tooltip} on:click={toggle}>
    <Size />
    <div class="anchor">
      <Popup anchor="bottom-left" bind:open>
        <Menu>
          <MenuItem on:click={() => document.execCommand("fontSize", null, "1")} iconPlaceholder={false}>
            <div class="size" style="font-size: 0.75em; height: 2.75em;">Pequeño</div>
          </MenuItem>

          <MenuItem on:click={() => document.execCommand("fontSize", null, "3")} iconPlaceholder={false}>
            Normal
          </MenuItem>

          <MenuItem on:click={() => document.execCommand("fontSize", null, "5")} iconPlaceholder={false}>
            <div class="size" style="font-size: 1.5em; height: 2em;">Grande</div>
          </MenuItem>

          <MenuItem on:click={() => document.execCommand("fontSize", null, "7")} iconPlaceholder={false}>
            <div class="size" style="font-size: 2em; height: 1.5em;">Gigante</div>
          </MenuItem>
        </Menu>
      </Popup>
    </div>
</x-command>