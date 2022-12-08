<script lang="ts" context="module">
  import type { Writable } from "svelte/store";
  export type DashContext = {
    user: User,
    mailboxes: Writable<Mailbox[]>
    drawerOpen: {
      narrow: Writable<boolean>,
      wide: Writable<boolean>,
    },
    toggle: () => void,
    reloadMailboxes: () => Promise<void>,
  };
</script>

<script lang="ts">
  export let user: User;
  export let username: string;
  let _mailboxes: Mailbox[];
  export { _mailboxes as mailboxes };

  const mailboxes = writable(sortMailboxes(_mailboxes));
  
  const reloadMailboxes = async () => {
    const json = await _get("/api/mailboxes");
    $mailboxes = sortMailboxes(json.results);
  }

  import type { Mailbox, User } from "$lib/types";
  
  const toggle = () => {
    if(isNarrow()) {
      context.drawerOpen.narrow.update(v => !v);
    } else {
      context.drawerOpen.wide.update(v => !v);
    }
  }

  const context: DashContext = {
    drawerOpen: {
      narrow: writable(false),
      wide: writable(true),
    },
    user,
    toggle,
    mailboxes,
    reloadMailboxes
  };

  setContext("dash", context);

  import { writable } from "svelte/store";
  import { onMount, setContext } from "svelte";
  import Navigating from "$lib/Navigating.svelte";
  import Drawer from "./Drawer.svelte";
  import Top from "./Top.svelte";
  import { isNarrow, sortMailboxes, watchAuth, _get } from "$lib/util";
  import { Counters, Exists, Expunge } from "$lib/events";
  import { run_all } from "svelte/internal";
  import { fly } from "svelte/transition";
  import { destroyComposer } from "$lib/Compose/compose";

  onMount(() => {
    const stream = new EventSource("/api/updates");
    stream.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if(data.command === "COUNTERS") {
        Counters.dispatch(data);
      } else if (data.command === "EXISTS") {
        Exists.dispatch(data);
      } else if(data.command === "EXPUNGE") {
        Expunge.dispatch(data);
      }
    }

    const off = [
      Counters.on(data => {
        const mbox = $mailboxes.find(item => item.id === data.mailbox);
        if(mbox) {
          mbox.total = data.total;
          mbox.unseen = data.unseen;
          $mailboxes = $mailboxes;
        }
      }),
      watchAuth(user?.id ?? null),
      () => stream.close(),
      () => destroyComposer(),
    ]

    return () => {
      run_all(off)
    }
  })
</script>

<style>
  .dashboard {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
  }

  .main {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex: 1;
  }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="dashboard" in:fly={{duration: 400, y: -25}}>
  <Navigating />
  <Top {username} />
  <div class="main">
    <Drawer />
    <div class="page">
      <slot />
    </div>
  </div>
</div>
