<style>
.text-field{
  position: relative;
  display: flex;
}

input, textarea{
  font: inherit;
  box-sizing: content-box;
  outline: none;
  flex: 1;
  margin: 0;
  border: 1px rgba(0,0,0,0.23) solid;
  border-radius: 3px;
  padding: 0.9em 0.75em;
  width: 100%;
  color: inherit;
  transition: border-color 150ms ease-in-out;
  background-color: #fff;
}

textarea{
  resize: none;
  overflow: auto;
}

input:disabled, textarea:disabled{
  color: rgba(0,0,0,0.5);
}

input:focus, textarea:focus{
  border-color: var(--pc);
}

.label{
  position: absolute;
  top: calc(2px + 0.9em);
  left: calc(1px + 0.75em);
  padding: 0 0.4em;
  margin: 0 -0.4em;
  pointer-events: none;
  background: #fff;
  color: rgba(0,0,0,0.5);
  transition: color 150ms ease, transform 150ms ease-in-out;
  transform-origin: top left;
  max-width: calc(100% - 1em);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-field:not(.empty) > .label,
input:focus + .label,
textarea:focus + .label{
  transform: scale(0.7) translateY(-165%);
}

input:focus + .label,
textarea:focus + .label{
  color: var(--dark);
}

</style>

<script>
let className = "";
export {className as class};
export let type = "text";
export let value = "";
//export let placeholder = "";
export let label = null;
export let disabled = false;
export let readonly = false;
export let spellcheck = null; // string
export let resize = null; // (none) vertical horizontal both unset initial inherit
export let id = null;
export let name = null;
export let step = null;
export let max = null;
export let min = null;

export let multiline = false;
export let minrows = 1;
export let maxrows = Infinity;

let rows = 1;
$:{
  if(multiline){
    rows = Math.max(minrows, Math.min(maxrows, value.split("\n").length))
  };
}
$: empty = value === "";

const handleChange = (event) => {
  if(type === "number"){
    value = parseFloat(event.target.value) || 0;
  } else {
    value = event.target.value;
  }
}
</script>

<div 
  class="text-field {className}"
  class:empty
  class:disabled
  class:readonly
  class:multiline
>
  {#if !multiline}
    <input 
    {id}
    {name}
    {type}
    {step}
    {max}
    {min}
    {value}
    {readonly}
    {disabled}
    {spellcheck}
    on:input={handleChange}
    on:input
    on:focus
    on:blur
    on:change
    on:keypress
    on:keydown
    on:keyup
    />
    {#if label != null}
      <span class="label">{label}</span>
    {/if}
  {:else}
    <textarea 
    {id}
    {name}
    {value}
    {readonly}
    {disabled}
    {rows}
    {spellcheck}
    on:input={handleChange}
    on:input
    on:focus
    on:blur
    on:change
    on:keypress
    on:keydown
    on:keyup
    style={resize ? `resize: " ${resize}` : ''}
    />
    {#if label != null}
      <span class="label">{label}</span>
    {/if}
  {/if}
</div>