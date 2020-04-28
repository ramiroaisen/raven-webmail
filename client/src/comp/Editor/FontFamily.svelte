<script>
  import {getContext} from "svelte";
  const {cmd} = getContext("editor");

  import FontFamily from "svelte-material-icons/FormatFont.svelte";
  import Menu from "svelte-mui/src/Menu.svelte";
  import {Menuitem} from "svelte-mui";
</script>


<Menu origin="bottom left" dx={0} dy={25}>
  <x-command slot="activator" class="multiple" data-tooltip="Tipo de fuente">
    <FontFamily />   
  </x-command>

  <Menuitem
    style="font-family: sans-serif;"
    on:click={() => cmd("fontName", "sans-serif")}
  >Sans Serif</Menuitem>
  
  <Menuitem
    style="font-family: serif;"
    on:click={() => cmd("fontName", "serif")}
  >Serif</Menuitem>
  
  <Menuitem
    style="font-family: monospace;"
    on:click={() => cmd("fontName", "monospace")}
  >Monospace</Menuitem>

  <!--
  <Menuitem
    style="font-family: system-ui, -apple-system, BlinkMacSystemFont;"
    on:click={() => cmd("fontName", "system-ui, -apple-system, BlinkMacSystemFont")}
    >Fuente del sistema</Menuitem>
  -->
</Menu>

