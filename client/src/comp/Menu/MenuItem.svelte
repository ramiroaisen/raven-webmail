<style>
    .menu-item {
        display: flex;
        flex-direction: row;
        min-height: 2.5em;
        align-items: center;
        color: #333;
        padding-inline-end: 1em;
    }

    .noplaceholder {
        padding-inline-start: 1em;
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
    export let iconPlaceholder = true;
    import {Ripple} from "svelte-mui";
</script>

<a class="menu-item na btn-dark" class:noplaceholder={!iconPlaceholder} {href} on:click>
    {#if icon || iconPlaceholder}
        <div class="icon">
            {#if icon}
                <svelte:component this={icon} />
            {/if}
        </div>
    {/if}
    <slot/>
    <Ripple />
</a>
