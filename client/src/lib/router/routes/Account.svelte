<script context="module">
    import {user} from  "../../client/client";

    export async function preload($page, {client}) {
       if (!user.get()) {
            return this.redirect("#!/login");
        }
    }
</script>

<script>
    import Account from "comp@Pages/Account/Account.svelte";
    import {getContext} from "svelte";
    const {locale} = getContext("app");
</script>

<svelte:head>
    <title>{$locale.myAccount.title}</title>
</svelte:head>

<Account user={$user} />