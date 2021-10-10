<script lang="ts">
  export let value: any = void 0;
  export let optionsMap: Record<string, any> = {};
  export let options: { label: string; value: any }[] = Object.entries(
    optionsMap
  ).map(([value, label]) => ({ value, label }));
  export let label: string;
  export let open = false;
  export let readonly: boolean = false;
  export let validate: boolean = false;
  export let focusable: HTMLElement | undefined = void 0;

  export let validationError: string | null = null;

  $: selectedOption = options.find((option) => {
    if (option.value == null && value == null) return true;
    return equals(option.value, value);
  });

  import { getContext, onMount } from "svelte";
  import { equals } from "./util";
  import type { Context } from "./Formy/Formy.svelte";
  import ValidationError from "./Formy/ValidationError.svelte";

  import Menu from "./Menu/Menu.svelte";
  import MenuItem from "./Menu/MenuItem.svelte";
  import TextField from "./TextField.svelte";

  const doValidate = (): boolean => {
    if (!validate) {
      validationError = null;
      return true;
    }

    if (!options.find((option) => equals(value, option.value))) {
      validationError = "Oops! You missed this field";
      console.log("[Formy] validation fails [Select]", label, value);
      return false;
    }

    return true;
  };

  const formy = getContext("formy") as Context | undefined;
  onMount(() => formy && formy.register(doValidate));

  const accommodate = (node: HTMLElement) => {
    const rect = node.getBoundingClientRect();
    const bound = {
      x: 5,
      y: 5,
      right: window.innerWidth - 5,
      bottom: window.innerHeight - 5,
    };
    if (bound.right < rect.right) {
      node.style.marginLeft = `${bound.right - rect.right}px`;
    } else if (bound.x > rect.x) {
      node.style.marginLeft = `${rect.x - bound.x}px`;
    }

    if (bound.bottom < rect.bottom) {
      node.style.marginTop = `${bound.bottom - rect.bottom}px`;
    } else if (bound.y > rect.y) {
      node.style.marginTop = `${rect.y - bound.y}px`;
    }
  };
</script>

<div class="select" on:click={() => { !readonly && (open = !open) }}>

  <TextField
    readonly
    {label}
    value={selectedOption ? selectedOption.label : ""}
    bind:focusable
    on:focus={() => validationError = null}
    on:blur={() => { open = false }}
  />
  <div class="arrow">▼</div>
  {#if open}
    <div
      class="options elev3"
      use:accommodate
      on:click|stopPropagation={() => {}}
    >
      <Menu>
        {#each options as option}
          <MenuItem on:pointerdown={() => {value = option.value; open = false}}>
            <slot item={option}>
              {option.label}
            </slot>
          </MenuItem>
        {/each}
      </Menu>
    </div>
  {/if}

  {#if validationError}
    <ValidationError
      message={validationError}
      on:click={() => focusable && focusable.focus()}
    />
  {/if}
</div>

<style>
  .select {
    position: relative;
  }

  .select :global(input) {
    cursor: pointer !important;
    user-select: none;
  }
  .arrow {
    display: flex;
    position: absolute;
    top: 50%;
    right: 0.5em;
    transform: translateY(-50%);
  }

  .options {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    z-index: 100000;
    background: #fff;
    max-height: 95vh;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
