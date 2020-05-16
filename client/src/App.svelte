<script>
	import {setContext} from "svelte";
	import Dashboard from "./comp/Dashboard/Dashboard.svelte";
	import Router from "./lib/router/Router.svelte";
	import Preloading from "./lib/router/Preloading.svelte";

	export let app;

	const {session, router} = app;

	setContext("app", app);
	setContext("session", session);
	setContext("router", router);
</script>

<Preloading preloading={router.preloading} />

<Dashboard>
	<Router {router} />
</Dashboard>