<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import { getPage } from "$lib/util";
  export const load: Load = async ({ fetch, session }) => {
    // @ts-ignore
    return await getPage({ page: "/api/pages/layout", fetch, session });
  }
</script>

<script lang="ts">
  export let user: User;
  export let username: string;
  export let mailboxes: Mailbox[]

  import Dashboard from "$lib/Dashboard/Dashboard.svelte";
  import type { Mailbox, User } from "$lib/types";
	import { onMount } from "svelte";
	import { RAVEN_SIGNATURE_META_KEY, signature } from "$lib/signature";

  onMount(() => {
    signature.set(user?.metaData?.[RAVEN_SIGNATURE_META_KEY] || "");
  })
</script>

<Dashboard bind:username bind:user bind:mailboxes>
  <slot />
</Dashboard>