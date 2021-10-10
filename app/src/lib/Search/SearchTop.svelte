<script lang="ts">
  export let results: Message[];
  // export let loadingMore: boolean;
  export let selection: Message[];
  //export let nextCursor: string | null;
  //export let prevCursor: string | null;
  export let total: number;
  export let scrolled = false;
  export let mailboxMap: Map<string, Mailbox>;

  import type { Mailbox, Message } from "$lib/types";

  import Refresh from "svelte-material-icons/Refresh.svelte";
  import Delete from "svelte-material-icons/DeleteOutline.svelte";
  import MarkUnSeen from "svelte-material-icons/EmailOutline.svelte";
  import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  //import MarkSpam from "svelte-material-icons/AlertDecagramOutline.svelte";
  //import UnMarkSpam from "svelte-material-icons/EmailCheckOutline.svelte";
  import CheckAll from "svelte-material-icons/CheckboxMarked.svelte";
  import CheckNone from "svelte-material-icons/CheckboxBlankOutline.svelte";
  import CheckSome from "svelte-material-icons/CheckboxIntermediate.svelte";
  import Check from "svelte-material-icons/Check.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { tooltip } from "$lib/actions";
  import { fade } from "svelte/transition";
  import { action, isDrafts, isTrash, _delete, _post, _put } from "$lib/util";

  //import MoveTo from "$lib/MoveTo.svelte";
  import { getContext } from "svelte";

  const { prev, next } = getContext("search") as MailboxContext;

  import type { DashContext } from "../Dashboard/Dashboard.svelte";
  import type { MailboxContext } from "../Mailbox/Mailbox.svelte";
  import TabTop from "$lib/Tab/TabTop.svelte";
  import { _error, _message } from "$lib/Notify/notify";
import { locale } from "$lib/locale";
  
  const { mailboxes } = getContext("dash") as DashContext;
  //const { prev, next } = getContext("mailbox") as MailboxContext;

  let reloadTimes = 0;
  const reload = () => {
    reloadTimes++;
    prev();
  }

  const markAsSeen = action(async (v: boolean) => {
    if(selection.length === 0) return;
    const calls = new Map<string, number[]>();
    for(const item of selection) {
      const call = calls.get(item.mailbox);
      if(call == null) {
        calls.set(item.mailbox, [item.id]);
      } else {
        call.push(item.id);
      }
    }

    const actions: Promise<void>[] = [];

    for(const [mailbox, ids] of calls.entries()) {
      actions.push(_put(`/api/mailboxes/${mailbox}/messages`, {
        message: ids.join(","),
        seen: v,
      }))
    }

    await Promise.all(actions);

    for(const item of selection) {
      item.seen = v;
    }

    results = [...results];
    selection = [...selection];
  })

  const del = action(async () => {
    if(selection.length === 0) return;
    const trash = $mailboxes.find(isTrash)!;
    const actions: Promise<void>[] = [];
    const toTrash = new Map<string, number[]>();

    for(const item of selection) {
      const mailbox = mailboxMap.get(item.mailbox)!;
      if(isTrash(mailbox) || isDrafts(mailbox)) {
        console.log("delete");
        actions.push(_delete(`/api/mailboxes/${item.mailbox}/messages/${item.id}`));
      } else {
        console.log("move");
        const ids = toTrash.get(item.mailbox);
        if(ids) {
          ids.push(item.id);
        } else {
          toTrash.set(item.mailbox, [ item.id ]);
        }
      }
    }
    
    for(const [mailbox, ids] of toTrash.entries()) {
      actions.push(_put(`/api/mailboxes/${mailbox}/messages`, {
        message: ids.join(","),
        moveTo: trash.id
      }));
    }

    await Promise.all(actions);

    removeSelection();
  })

  const toggleAll = () => {
    if(selection.length === results.length) {
      selection = [];
    } else {
      selection = results.slice();
    }
  }

  const removeSelection = () => {
    const keys = selection.map(item => `${item.mailbox}-${item.id}`);
    
    results = results.filter(item => !keys.includes(`${item.mailbox}-${item.id}`))

    if(results.length < 25) {
      setTimeout(next, 10);
    }  
    
    selection = [];
  }

  const move = action(async (to: Mailbox) => {
    /*
    //if(mailbox.id === to.id) return;
    if(selection.length === 0) return;
    await _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: selection.map(m => m.id).join(","),
      moveTo: to.id,
    })
    removeSelection();
    */
  })
</script>

<style>
  .only-when-selection {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .reload-inner {
    display: flex;
    transition: transform 300ms ease;
  }

  .select {
    margin-inline-start: 0.525rem;
  }

  @media screen and (max-width: 650px) {
    .select {
      margin-inline-start: 0.1rem;
    }
  }

  .selection-info {
    display: flex;
    flex: none;
    flex-direction: row-reverse;
    align-items: center;
    margin-inline-start: auto;
    margin-inline-end: 1rem;
    background: #c2dbff;
    padding: 0.4em 0.5em;
    border-radius: 100px;
    color: #555;
  }

  .selection-info > :global(svg) {
    font-size: 1.1em;
  }

  .selection-info > span {
    font-size: 0.8em;
    margin: 0 0.5em;
  }

  .count {
    margin-inline-start: auto;
    margin-inline-end: 1rem;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    background: #e6e6e6;
  }
</style>

<TabTop {scrolled}>
 <div class="action-group select">
    <div class="action btn-dark" on:click={toggleAll}>
      {#if selection.length === 0}
        <CheckNone />
      {:else if selection.length === results.length}
        <CheckAll />
      {:else}
        <CheckSome />
      {/if}
      <Ripple />
    </div>

    <div class="action btn-dark reload" use:tooltip={$locale.Reload} on:click={reload}>
      <div class="reload-inner" style="transform: rotate({360 * reloadTimes}deg);">
        <Refresh />
      </div>
      <Ripple />
    </div>
  </div>

 {#if selection.length === 0 && total !== 0}
  <div class="count">
    {#if total === 1}
      1 {$locale.message}
    {:else}
      {total} {$locale.messages}
    {/if}
  </div>
 {:else if selection.length !== 0}
    <div class="only-when-selection" in:fade|local={{ duration: 200 }}>
      <div class="action-group">
        {#if !selection.every(m => m.seen)}
          <div class="action btn-dark" use:tooltip={$locale.Mark_as_seen} on:click={() => markAsSeen(true)}>
            <MarkSeen />
            <Ripple />
          </div>
        {:else}
          <div class="action btn-dark" use:tooltip={$locale.Mark_as_not_seen} on:click={() => markAsSeen(false)}>
            <MarkUnSeen />
            <Ripple />
          </div>
        {/if}

        <div class="action btn-dark" use:tooltip={$locale.Delete} on:click={del}>
          <Delete />
          <Ripple />
        </div>
      </div>

      <!--
      <div class="action-group">
        <MoveTo {mailbox} onMove={move} />
      </div>
      -->

      <div class="selection-info">
        <Check />
        <span>
          {selection.length}
          {#if selection.length === 1}
            {$locale.message}
          {:else}
            {$locale.messages}
          {/if}
        </span>
      </div>
    </div>
  {/if}
</TabTop>