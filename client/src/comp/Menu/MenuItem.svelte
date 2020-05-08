<style>
    .menu-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #333;
        padding-inline-end: 1em;
    }

    .icon {
        flex: none;
        width: 2.5em;
        height: 2.5em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon > :global(svg) {
        font-size: 1.25em;
    }
</style>

<script>
    export let icon;
    export let href = null;
    import {Ripple} from "svelte-mui";
</script>

<a class="menu-item na btn-dark" {href} on:click>
    <div class="icon">
        {#if icon}
            <svelte:component this={icon} />
        {/if}
    </div>
    <slot/>
    <Ripple />
</a>
