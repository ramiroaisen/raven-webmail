<script context="module">
    import {user, get} from "lib@client/client.js";
    export async function preload() {
        if(!user.get()) {
            return this.redirect("#!/login");
        }

        const filters = await get("/users/me/filters");


        return {user, filters};
    }
</script>

<script>
    export let user;
    export let filters;

    import Filters from "comp@Pages/Filters/Filters.svelte";
</script>

<Filters {user} {filters} />

