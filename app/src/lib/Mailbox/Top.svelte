<script lang="ts">
  export let mailbox: Mailbox;
  export let messages: Messages;
  export let selection: Message[];
  export let scrolled = false;
  export let loadingMore: boolean;
  let clearMenuOpen = false;
  let clearOpen = false;

  import type { Mailbox, Messages, Message } from "$lib/types";

  import Refresh from "svelte-material-icons/Refresh.svelte";
  import Delete from "svelte-material-icons/DeleteOutline.svelte";
  import MarkUnSeen from "svelte-material-icons/EmailOutline.svelte";
  import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  import MarkSpam from "svelte-material-icons/AlertDecagramOutline.svelte";
  import UnMarkSpam from "svelte-material-icons/EmailCheckOutline.svelte";
  import CheckAll from "svelte-material-icons/CheckboxMarked.svelte";
  import CheckNone from "svelte-material-icons/CheckboxBlankOutline.svelte";
  import CheckSome from "svelte-material-icons/CheckboxIntermediate.svelte";
  import Check from "svelte-material-icons/Check.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { tooltip } from "$lib/actions";
  import { fade } from "svelte/transition";
  import { action, isDrafts, isInbox, isJunk, isSent, isTrash, mailboxName, _delete, _put } from "$lib/util";

  import MoveTo from "$lib/MoveTo.svelte";
  import { getContext } from "svelte";

  import type { DashContext } from "../Dashboard/Dashboard.svelte";
  import type { MailboxContext } from "../Mailbox/Mailbox.svelte";
  import TabTop from "$lib/Tab/TabTop.svelte";
  import Dialog from "$lib/Dialog.svelte";
  import DotsVertical from "svelte-material-icons/DotsVertical.svelte";
  import PortalPopup from "$lib/PortalPopup.svelte";
  import Menu from "$lib/Menu/Menu.svelte";
  import MenuItem from "$lib/Menu/MenuItem.svelte";
import { _error, _message } from "$lib/Notify/notify";
import { locale } from "$lib/locale";
  
  const { mailboxes } = getContext("dash") as DashContext;
  const { prev, next } = getContext("mailbox") as MailboxContext;

  let reloadTimes = 0;
  const reload = () => {
    reloadTimes++;
    prev();
  }

  const markAsSeen = action(async (v: boolean) => {
    const ids = selection.map(s => s.id);

    await _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: ids.join(","),
      seen: v
    })
  
    for(const item of selection) {
      item.seen = v;
    }

    messages = {...messages};
    selection = [...selection]; 
  })

  const spam = action(async () => {
    if(isJunk(mailbox)) {
      const inbox = $mailboxes.find(isInbox)!;
      await move(inbox);
    } else {
      const junk = $mailboxes.find(isJunk)!;
      await move(junk);
    }
  })

  const del = action(async () => {
    if(isTrash(mailbox) || isJunk(mailbox)) {
      await Promise.all(selection.map(async item => {
        await _delete(`/api/mailboxes/${mailbox.id}/messages/${item.id}`);
      }))
      removeSelection();
    } else {
      const trash = $mailboxes.find(isTrash)!;
      move(trash);
    }
  })

  const clear = action(async () => {
    if(isTrash(mailbox) || isDrafts(mailbox)) {
      _delete(`/api/mailboxes/${mailbox.id}/messages`)
        .then(() => {
          _message($locale.notifier.All_messages_deleted);
        }).catch(e =>  {
          _error(e?.message)
        })
    } else {
      const trash = $mailboxes.find(isTrash)!;
      _put(`/api/mailboxes/${mailbox.id}/messages`, {
        message: `1:${Number.MAX_SAFE_INTEGER}`,
        moveTo: trash.id,
      }).then(() => {
        _message("All messages deleted");
      }).catch(e => {
        _error(e?.message);
      })
    }
    clearOpen = false;
    if(mailbox.total > 50) _message($locale.notifier.Deleting_process);
  })

  const toggleAll = () => {
    if(selection.length === messages.results.length) {
      selection = [];
    } else {
      selection = messages.results.slice();
    }
  }

  const removeSelection = () => {
    const ids = selection.map(item => item.id);
    
    messages = {
      ...messages,
      results: messages.results.filter(item => !ids.includes(item.id))
    }

    if(messages.results.length < 15 && messages.nextCursor) {
      loadingMore = true;
      setTimeout(next, 10);
    }  
    
    selection = [];
  }

  const move = action(async (to: Mailbox) => {
    if(mailbox.id === to.id) return;
    if(selection.length === 0) return;
    await _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: selection.map(m => m.id).join(","),
      moveTo: to.id,
    })
    removeSelection();
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

  .clear-body {
    display: flex;
    flex-direction: column;
  }

  .clear-label {
    margin-bottom: 1.5rem;
  }

  .clear-confirm {
    margin-inline-start: auto;
  }

  .clear-btn-wrap {
    position: relative;
  }

  .clear-anchor {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .total {
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
      {:else if selection.length === messages.results.length}
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

  {#if selection.length === 0 && messages.results.length !== 0}
    <div class="action-group" in:fade|local={{ duration: 200 }}>
      <div class="clear-btn-wrap">
        <div class="action btn-dark" class:hover={clearMenuOpen} on:click={() => clearMenuOpen = true}>
          <DotsVertical />
          <Ripple />
        </div>
        <div class="clear-anchor">
          <PortalPopup anchor="top-left" bind:open={clearMenuOpen}>
            <Menu>
              <MenuItem icon={Delete} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>
            </Menu>
          </PortalPopup>
        </div>
      </div> 
    </div>

    <div class="total">
      {#if mailbox.total === 1}
        1 {$locale.message}
      {:else}
        {mailbox.total} {$locale.messages}
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

        {#if isJunk(mailbox)}
          <div class="action btn-dark" use:tooltip={$locale.This_is_not_spam} on:click={spam}> 
            <UnMarkSpam />
            <Ripple />
          </div>
        {:else if !isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox)}
          <div class="action btn-dark" use:tooltip={$locale.Mark_as_spam} on:click={spam}> 
            <MarkSpam />
            <Ripple />
          </div>
        {/if}

        <div class="action btn-dark" use:tooltip={isTrash(mailbox) ? $locale.Delete_permanently : isDrafts(mailbox) ? $locale.Discard_drafts : $locale.Delete} on:click={del}>
          <Delete />
          <Ripple />
        </div>
      </div>

      <div class="action-group">
        <MoveTo {mailbox} onMove={move} />
      </div>

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

{#if clearOpen}
  <Dialog title="{$locale.Delete_all_messages} {$locale.of} {mailboxName(mailbox)}" width="550px" onClose={() => clearOpen = false}>
    <div class="clear-body">
      <div class="clear-label">
        {$locale.This_action_will_delete_all_messages_in_the_folder}
      </div>
      <button class="clear-confirm btn-light btn-primary elev2" on:click={clear}>
        {$locale.Delete_all_messages}
      </button>
    </div>
  </Dialog>
{/if}