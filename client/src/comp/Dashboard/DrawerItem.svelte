<style>
    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.25em 0 0.25em 0.25em;
        background: #fff;
        cursor: pointer;
        user-select: none;
    }

    .current:after {
        background-color: rgba(var(--pc-rgb), 0.15);
    }

    .icon {
        display: flex;
        padding: 0.5em;
        font-size: 1.25em;
    }

    .label {
        flex: 1;
    }

    .count-menu {
        position: relative;
        z-index: 1;
    }

    .menu-open .count-menu {
        z-index: 2;
    }

    .menu {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 300ms ease;
        transform: translate(-100%, -50%);
    }

    .menu-open .menu {
        z-index: 1;
    }


    .menu > :global([slot=menu]) {
        position: relative;
    }

    .counter {
        position: absolute;
        right: 0;
        top: 50%;
        font-size: 0.85em;
        transform: translateY(-50%);
        margin-inline-end: 1em;
        transition: opacity 300ms ease;
        pointer-events: none;
    }

    .item:hover .menu + .counter,
    .menu-open .menu + .counter {
        opacity: 0;
    }

    .item:hover .menu,
    .menu-open .menu {
        opacity: 1;
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
    export let menu = false;
    export let menuOpen = false;
</script>

<a {href} class="na item btn-dark" class:current class:menu-open={menuOpen} on:click on:click={(e) => drawerOpenMobile.set(false)}>
  <span class="icon">
    <svelte:component this={icon} />
  </span>
    <span class="label">{label}</span>
    <div class="count-menu">
        {#if menu}
            <div class="menu" on:click|stopPropagation|preventDefault>
                <slot name="menu"></slot>
            </div>
        {/if}
        {#if counter}
            <span class="counter" transition:scale={{duration: 200}}>{counter}</span>
        {/if}
    </div>
    <Ripple />
</a>