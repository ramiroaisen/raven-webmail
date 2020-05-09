<style>
  x-color{
    display: flex;
    flex-direction: row;
  }

  .anchor {
    position: absolute;
    top: 0;
    left: 50%;
  }
</style>

<script>
  import {getContext} from "svelte";
  const {cmd, has} = getContext("editor");

  import Fill from "svelte-material-icons/FormatColorFill.svelte"
  import ColorGroup from "./ColorGroup.svelte";

  export let locale;

  export let open = false;
  const toggle = () => open = !open;

  import Popup from "comp@Popup.svelte";
</script>

<x-command-group>
  <x-command class="multiple" class:hover={open} data-tooltip={open ? null : locale.tooltip} on:click={toggle}>
    <Fill />
    <div class="anchor">
      <Popup anchor="bottom-center" bind:open>
        <x-color>
          {#if has("foreColor")}
            <ColorGroup variant="foreColor" label={locale.foreColor} />
          {/if}
          {#if has("backColor")}
            <ColorGroup variant="backColor" label={locale.backColor} />
          {/if}
        </x-color>
      </Popup>
    </div>
  </x-command>
</x-command-group>