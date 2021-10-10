<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import type { Mailbox } from "$lib/types";
    
  // @ts-ignore
  export const load: Load = async function({stuff}) {
    const mailboxes = stuff.mailboxes as Mailbox[];
    const inbox = mailboxes[0];
    if(inbox !== null) {
      return {
        status: 302,
        redirect: `/mailbox/${mailboxes[0].id}`
      }
    }

    return {}
  }
</script>

<h1>You dont have any mailbox :(</h1>