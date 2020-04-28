<style>
  a{
    text-decoration: inherit;
    color: inherit;
  }

  button,
  input {
    font: inherit;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
  }

  .button {
    display: inline-flex;
    cursor: pointer;
    transition: background-color ease 300ms;
    padding: 0.7em 0.9em;
    border-radius: 4px;
    outline: none;
    color: currentColor;
  }

  .fixedsize > .button-in {
    width: 100%;
    height: 100%;
  }

  a.disabled {
    pointer-events: none;
  }

  .button:hover {
    background: rgba(0, 0, 0, 0.15);
  }

  .button:active {
    background: rgba(0, 0, 0, 0.25);
  }

  .rounded {
    border-radius: 1000px; /*ensure circular*/
    padding-left: 1.25em;
    padding-right: 1.25em;
  }

  .button-in {
    flex: none;
    margin: auto;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }

  .button-in :global(.icon) {
    width: 1.1em;
    height: 1.1em;
  }

  .button-in :global(.icon):first-child {
    margin-right: 0.75em;
  }

  .button-in :global(.icon):last-child {
    margin-left: 0.75em;
  }

  .button-in :global(.icon):only-child {
    margin: auto;
    height: 1.5em;
    width: 1.5em;
  }

  .primary,
  .secondary,
  .add,
  .remove {
    color: #fff;
    box-shadow: inset rgba(0, 0, 0, 0.1) 0 0 1px 1px,
      0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  }

  .primary {
    background-color: var(--pc);
  }

  .primary:hover {
    background: rgba(var(--pc-rgb), 0.9);
  }

  .primary:active {
    background: rgba(var(--pc-rgb), 0.8)
  }

  .add {
    background-color: #43a047;
  }

  .add:hover {
    background-color: darken(#43a047, 10%);
  }

  .add:active {
    background-color: darken(#43a047, 25%);
  }

  .remove {
    background-color: #d32f2f;
  }

  .remove:hover {
    background-color: darken(#d32f2f, 10%);
  }

  .remove:active {
    background-color: darken(#d32f2f, 25%);
  }

  .disabled,
  .disabled:hover,
  .disabled:active {
    color: rgba(0, 0, 0, 0.26);
    background-color: rgba(0, 0, 0, 0.12);
    box-shadow: none;
    cursor: default;
  }

  .fab {
    box-shadow: none;
  }
</style>

<script>
  let className = "";
  export { className as class };
  export let href = null;
  export let type = null;
  export let value = null;
  export let tabindex = null;
  export let variant = "normal"; // normal primary secondary add remove
  export let disabled = false;
  export let rounded = false;
  export let fab = false;
  //export let fixedsize = false;
  export let rel = null;

  $: cls = `button ${variant} ${className}`;
</script>

{#if href != null}
  <a
    class={cls}
    class:disabled
    class:rounded
    class:fab
    href={!disabled && href}
    {rel}
    {tabindex}
    on:click
    on:focus
    on:blur
    on:change>
    <span class="button-in">
      <slot />
    </span>
  </a>
{:else if type === 'submit'}
  <input
    type="submit"
    class={cls}
    class:disabled
    class:rounded
    class:fab
    {value}
    {disabled}
    {tabindex}
    on:click
    on:focus
    on:blur
    on:change />
{:else}
  <button
    class={cls}
    class:disabled
    class:rounded
    class:fab
    {disabled}
    {tabindex}
    on:click
    on:focus
    on:blur
    on:change>
    <span class="button-in">
      <slot />
    </span>
  </button>
{/if}
