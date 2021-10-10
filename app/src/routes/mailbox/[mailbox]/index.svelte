<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import { getPage } from "$lib/util";
  export const load: Load = ({ page, fetch, session }) => {
    // @ts-ignore
    return getPage({ page, fetch, session });
  };
</script>

<script lang="ts">
  export let mailbox: MBox;
  export let messages: Messages

  import type { Mailbox as MBox, Messages } from "$lib/types";
  
  import { mailboxName } from "$lib/util";
  import Mailbox from "$lib/Mailbox/Mailbox.svelte";
</script>

<svelte:head>
  <title>{mailbox.unseen ? `(${mailbox.unseen}) ` : ""}{mailboxName(mailbox)}</title>
</svelte:head>

{#key mailbox.id}
  <Mailbox bind:mailbox bind:messages />
{/key}