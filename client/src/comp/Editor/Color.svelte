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

  export let locale;
</script>

<x-command-group>
  <Menu origin="bottom left" dy={25}>
    <x-command slot="activator" class="multiple" data-tooltip={locale.tooltip}>
      <Fill />
    </x-command>

    <x-color>
      {#if has("foreColor")}
        <ColorGroup variant="foreColor" label={locale.foreColor} />
      {/if}
      {#if has("backColor")}
        <ColorGroup variant="backColor" label={locale.backColor} />
      {/if}
    </x-color>
  </Menu>
</x-command-group>