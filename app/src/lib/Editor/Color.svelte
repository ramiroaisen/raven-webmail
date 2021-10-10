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

<script lang="ts">
  export let open = false;
  const toggle = () => open = !open;

  import { getContext } from "svelte";

  import type { EditorContext } from "./Editor.svelte";
  const { cmd, has } = getContext("editor") as EditorContext;

  import Fill from "svelte-material-icons/FormatColorFill.svelte"
  import ColorGroup from "./ColorGroup.svelte";
  import Popup from "$lib/PortalPopup.svelte";
  import { tooltip } from "$lib/actions";
  import { locale } from "$lib/locale";
</script>

<x-command-group>
  <x-command class="multiple" class:hover={open} use:tooltip={open ? null : $locale.Color} on:click={toggle}>
    <Fill />
    <div class="anchor">
      <Popup anchor="bottom-center" bind:open>
        <x-color>
          {#if has("foreColor")}
            <ColorGroup variant="foreColor" label={$locale.Text} />
          {/if}
          {#if has("backColor")}
            <ColorGroup variant="backColor" label={$locale.Background} />
          {/if}
        </x-color>
      </Popup>
    </div>
  </x-command>
</x-command-group>