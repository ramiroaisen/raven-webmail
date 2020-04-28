<style>
  .password{
    position: relative;
  }

  .icon{
    position: absolute;
    right: 0;
    top: 0;
    width: 2em;
    height: 100%;
    cursor: pointer;
    color: rgba(0,0,0,0.4);
    transition: color 300ms ease;
    display: flex;
    font-size: 1.5em;
    user-select: none;
    align-items: center;
    justify-content: center;
  }

  .icon:hover{
    color: rgba(0,0,0,0.75);    
  }
</style>

<script>
import TextField from './TextField.svelte';
import Button from './Button.svelte';

import VisibilityOn from 'svelte-material-icons/Eye.svelte';
import VisibilityOff from 'svelte-material-icons/EyeOff.svelte';

let className = "";
export {className as class};

export let value = ""
export let textFieldProps = {};
export let visible = false;
export let label = void 0;
export let id = void 0;
export let name = void 0;

$: textFieldProps.type = visible ? "text" : "password";
$: label != null && (textFieldProps.label = label);

// prevent keyboard
export const toggle = () => visible = !visible;
</script>

<div class="password {className}">
  <TextField {...textFieldProps} bind:value 
  {id}
  {name}
  on:input
  on:focus
  on:blur
  on:change
  />
  <div class="icon" on:mousedown|preventDefault on:click|preventDefault={toggle}>
    {#if visible}
      <VisibilityOn/>
    {:else}
      <VisibilityOff/>
    {/if}
  </div>
</div>