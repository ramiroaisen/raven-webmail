<script>
  import Size from "svelte-material-icons/FormatSize.svelte";
  import Menu from "svelte-mui/src/Menu.svelte";
  import {Menuitem} from "svelte-mui";

  export let tooltip;
</script>

<Menu origin="bottom left" dx={0} dy={25}>
  <x-command slot="activator" class="multiple" data-tooltip={tooltip}>
    <Size />
  </x-command>

  <Menuitem
    on:click={() => document.execCommand("fontSize", null, "1")}
    style="font-size: 0.75em; height: 2.75em;"
  >Pequeño</Menuitem>
  
  <Menuitem
    on:click={() => document.execCommand("fontSize", null, "3")}
  >Normal</Menuitem>
  
  <Menuitem
    style="font-size: 1.5em; height: 2em;"
    on:click={() => document.execCommand("fontSize", null, "5")}
  >Grande</Menuitem>
  
  <Menuitem 
    style="font-size: 2em; height: 1.5em;"
    on:click={() => document.execCommand("fontSize", null, "7")}
  >Gigante</Menuitem>
</Menu>