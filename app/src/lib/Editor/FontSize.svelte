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

<script lang="ts">

  export let label: string;
  
  import { getContext } from "svelte";
  import type { EditorContext } from "./Editor.svelte";
  const { cmd } = getContext("editor") as EditorContext;

  import Size from "svelte-material-icons/FormatSize.svelte";

  export let open = false;
  const toggle = () => open = !open;

  import Popup from "$lib/PortalPopup.svelte";
  import Menu from "$lib/Menu/Menu.svelte"
  import MenuItem from "$lib/Menu/MenuItem.svelte"
import { tooltip } from "$lib/actions";
</script>


<x-command class="multiple" class:hover={open} use:tooltip={open ? null : label} on:click={toggle}>
    <Size />
    <div class="anchor">
      <Popup anchor="bottom-left" bind:open>
        <Menu>
          <MenuItem on:click={() => cmd("fontSize", "1")} iconPlaceholder={false}>
            <div class="size" style="font-size: 0.75em; height: 2.75em;">
              Small
            </div>
          </MenuItem>

          <MenuItem on:click={() => cmd("fontSize", "3")} iconPlaceholder={false}>
            Normal
          </MenuItem>

          <MenuItem on:click={() => cmd("fontSize", "5")} iconPlaceholder={false}>
            <div class="size" style="font-size: 1.5em; height: 2em;">
              Big
            </div>
          </MenuItem>

          <MenuItem on:click={() => cmd("fontSize", "7")} iconPlaceholder={false}>
            <div class="size" style="font-size: 2em; height: 1.5em;">
              Giant
            </div>
          </MenuItem>
        </Menu>
      </Popup>
    </div>
</x-command>