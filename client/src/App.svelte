<script>
	import {setContext} from "svelte";
	import Dashboard from "./comp/Dashboard/Dashboard.svelte";
	import Router from "./lib/router/Router.svelte";

	export let app;

	const {session, router} = app;

	setContext("app", app);
	setContext("session", session);
	setContext("router", router);
</script>

<Dashboard>
	<Router {router} />
</Dashboard>