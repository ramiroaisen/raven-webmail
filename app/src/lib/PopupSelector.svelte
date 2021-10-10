<script lang="ts">
  
  export let value: any;
  export let options: {label: string, value: any}[];
  export let onChange: (value: any, prev: any) => void = () => {};
  export let open: boolean = false;

  export let anchorLeft: boolean = false;

  $: selectedOption = options.find(option => option.value === value);

  import Menu from "./Menu/Menu.svelte";
  import MenuItem from "./Menu/MenuItem.svelte";
  import Popup from "./Popup.svelte";
  import Ripple from "./Ripple.svelte";

  import Triangle from "svelte-material-icons/Triangle.svelte";

  const set = (v: any) => {
    if(v === value) return;
    const prev = value;
    value = v;
    onChange(value, prev);
  }
</script>

<style>
  .selector {
    position: relative;
  }

  .anchor {
    position: absolute;
    bottom: 0;
  }

  .anchor:not(.anchor-left){
    right: 0;  
  }

  .anchor-left {
    left: 0;
  }

  .button {
    font-size: 0.9rem;
    padding: 0.75rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: rgba(0,0,0,0.18) 1px solid;
  }

  .arrow {
    display: flex;
    font-size: 0.5rem;
    margin-inline-start: 0.5rem;
    transform: scaleY(-1);
    padding-inline-start: 1rem;
    margin-inline-start: auto;
  }
</style>

<div class="selector">
  <div class="button btn-dark" on:click={() => open = !open} class:hover={open}>
    {selectedOption && selectedOption.label || ""}
    <div class="arrow">
      <Triangle />
    </div>
    <Ripple />
  </div>

  <div class="anchor" class:anchor-left={anchorLeft}>
    <Popup anchor={anchorLeft ? "top-left" : "top-right"} bind:open>
      <Menu>
        {#each options as option}
          <MenuItem on:click={() => set(option.value)}>
            {option.label}
          </MenuItem>
        {/each}
      </Menu>
    </Popup>
  </div>
</div>