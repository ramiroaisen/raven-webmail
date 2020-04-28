<style>
  x-color{
    display: flex;
    flex-direction: row;
    margin: -8px 0;
  }
</style>

<script>
  import {getContext} from "svelte";
  const {cmd, has} = getContext("editor");

  import Fill from "svelte-material-icons/FormatColorFill.svelte"
  
  import ColorGroup from "./ColorGroup.svelte";

  import Menu from "svelte-mui/src/Menu.svelte";
</script>

<x-command-group>
  <Menu origin="bottom left" dy={25}>
    <x-command slot="activator" class="multiple" data-tooltip="Color">
      <Fill />
    </x-command>

    <x-color>
      {#if has("foreColor")}
        <ColorGroup variant="foreColor" label="Texto" />
      {/if}
      {#if has("backColor")}
        <ColorGroup variant="backColor" label="Fondo" />
      {/if}
    </x-color>
  </Menu>
</x-command-group>