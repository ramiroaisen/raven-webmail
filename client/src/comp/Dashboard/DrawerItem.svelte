<style>
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.25em 0 0.25em 0.25em;
        background: #fff;
        cursor: pointer;
        user-select: none;
        /*
        background-color: transparent;
        transition: background-color 200ms ease;
        */
    }

    .current:after {
        background-color: rgba(var(--pc-rgb), 0.15);
    }

    .icon {
        display: flex;
        padding: 0.5em;
        font-size: 1.25em;
    }

    .label {}

    .count {
        margin-inline-start: auto;
        font-size: 0.85em;
        margin-inline-end: 1em;
    }
</style>

<script>
    import {getContext} from "svelte";
    import {scale} from "svelte/transition";
    import {Ripple} from "svelte-mui";

    const {drawerOpenMobile} = getContext("dash")

    export let href;
    export let label;
    export let icon;
    export let counter = null;
    export let current = false;
</script>

<a {href} class="na btn-dark" class:current on:click on:click={() => drawerOpenMobile.set(false)}>
  <span class="icon">
    <svelte:component this={icon} />
  </span>
    <span class="label">{label}</span>
    {#if counter}
        <span transition:scale={{duration: 200}} class="count">{counter}</span>
    {/if}
    <Ripple />
</a>