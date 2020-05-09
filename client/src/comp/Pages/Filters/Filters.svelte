<style>
    .filters {
        margin: 2em 3em;
    }

    p {
        margin-left: 0.5em;
    }
</style>

<script>
    export let user;
    export let filters;

    import {getContext} from "svelte";
    const {locale: l} = getContext("app");
    export let locale = $l;
</script>

<svelte:head>
    <title>{locale.filters.title}</title>
</svelte:head>

<div class="filters">
    <h1>{locale.filters.title}</h1>
    <p>{locale.filters.commingSoon}</p>
</div>