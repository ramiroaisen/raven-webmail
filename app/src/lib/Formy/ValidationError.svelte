<script lang="ts">
  export let message: string;
  export let attrFor: string = "";
  import { getContext, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import type { Context } from "./Formy.svelte";
  let messageElement: HTMLElement;
  const formy = getContext("formy") as Context | undefined;
  onMount(() => formy && formy.registerMessage(messageElement));
</script>

<style>
  .anchor-out {
    position: absolute;
    top: 0;
    left: 50%;
  }

  .anchor-in {
    position: relative;
  }

  .validation-error {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(rgba(0,0,0,0.5) 0 2px 1px);
    cursor: pointer;
    user-select: none;
  }

  .message {
    background: #c52727;
    padding: 0.5rem;
    text-shadow: #2d3033 0 1px 0;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    border-radius: 4px;
  }

  .arrow {
    display: flex;
    width: 1.5rem;
    height: 0.75rem;
    color: #c52727;
    margin-top: -1px;
  }

  svg {
    display: block;
    flex: 1;
  }

</style>

<div class="anchor-out">
  <div class="anchor-in">
    <label class="validation-error" for={attrFor} bind:this={messageElement} on:click transition:fly|local={{ y: -25, duration: 300 }}>
      <div class="message">{message}</div>
      <div class="arrow">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0L100 0L50 100Z" fill="currentColor"></path>
        </svg>
      </div>
    </label>
  </div>
</div>