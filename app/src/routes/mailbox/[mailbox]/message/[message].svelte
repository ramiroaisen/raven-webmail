<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import { getPage } from "$lib/util";
  export const load: Load = ({ page, fetch, session }) => {
    // @ts-ignore
    return getPage({ page, fetch, session });
  };
</script>

<script lang="ts">
  export let mailbox: Mailbox;
  export let message: FullMessage;

  $: browser && console.log({message});

  import type { FullMessage, Mailbox } from "$lib/types";
  
  import { action, isDrafts, isInbox, isJunk, isSent, isTrash, mailboxName, _delete, _put } from "$lib/util";
  
  import { purify, tooltip } from "$lib/actions";
  import TabTop from "$lib/Tab/TabTop.svelte";
  
  import Delete from "svelte-material-icons/DeleteOutline.svelte";
  import MarkUnseen from "svelte-material-icons/EmailOutline.svelte";
  import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  import MarkSpam from "svelte-material-icons/AlertDecagramOutline.svelte";
  import UnMarkSpam from "svelte-material-icons/EmailCheckOutline.svelte";
  import Resend from "svelte-material-icons/EmailSendOutline.svelte";
  import Reply from "svelte-material-icons/EmailReceiveOutline.svelte";
  import GoBack from "svelte-material-icons/ArrowLeft.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import MoveTo from "$lib/MoveTo.svelte";

  $: html = message.html?.join("").trim();
  let scrolled = false;
  const onScroll = (event: Event) => {
    let target = event.target as HTMLElement;
    scrolled = target.scrollTop !== 0;
  }

  import type { DashContext } from "$lib/Dashboard/Dashboard.svelte";
  import Attachments from "$lib/Attachments.svelte";
  import { fly } from "svelte/transition";
  import { _forward, _replyAll } from "$lib/Compose/compose";
  import { locale } from "$lib/locale";
  import { browser } from "$app/env";
  const { user, mailboxes } = getContext("dash") as DashContext;

  const seen = action(async () => {
    try {
      message.seen = !message.seen;
      await _put(`/api/mailboxes/${mailbox.id}/messages`, {
        message: String(message.id),
        seen: message.seen,
      })
    } catch(e) {
      message.seen = !message.seen;
      throw e;
    }
  })

  const spam = action(async () => {
    if(isJunk(mailbox)) {
      await move($mailboxes.find(isInbox)!)
    } else {
      await move($mailboxes.find(isJunk)!);
    }
  })

  const del = action(async () => {
    if(isTrash(mailbox) || isJunk(mailbox)) {
      await _delete(`/api/mailboxes/${mailbox.id}/messages/${message.id}`);
      await goto(`/mailbox/${mailbox.id}`);
    } else {
      await move($mailboxes.find(isTrash)!);
    }
  })

  const move = action(async (to: Mailbox) => {
    if(mailbox.id === to.id) return;
    await _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: String(message.id),
      moveTo: to.id,
    })
    await goto(`/mailbox/${mailbox.id}`);
  })

  const reply = action(async () => {
    const drafts = $mailboxes.find(isDrafts)!;
    await _replyAll(user, drafts, mailbox, message.id);
  })

  const forward = action(async () => {
    const drafts = $mailboxes.find(isDrafts)!;
    await _forward(drafts, mailbox, message.id);
  })
</script>

<style>

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .first-action {
    margin-inline-start: 0.5rem;
  }

  .message {
    flex: 1;
    overflow: auto;
  }

  .body {
    padding: 2rem;
  }

  .text {
    white-space: pre-wrap;
  }

  .detail {
    padding: 2rem;
  }

  .subject {
    font-size: 1.65rem;
    font-weight: 500;
    margin-bottom: 1.25rem;
  }

  .info {
    font-size: 1rem;
  }

  .info > div {
    margin-bottom: 0.75rem;
  }

  .from-name, .from-only-address, .to-address {
    font-weight: 500;
  }
</style>

<svelte:head>
  <title>{message.subject}</title>
</svelte:head>

{#key `${message.mailbox}-${message.id}`}
  <div class="page">

    <TabTop {scrolled}>
      <div class="action-group first-action">
        <a class="na action btn-dark" href="/mailbox/{mailbox.id}" use:tooltip={`${$locale.Back_to} ${mailboxName(mailbox)}`}>
          <GoBack />
          <Ripple />
        </a>
      </div>

      <div class="action-group">
        <div class="action btn-dark"
          use:tooltip={message.seen ? $locale.Mark_as_seen : $locale.Mark_as_not_seen}
          on:click={seen}
        >
          {#if message.seen}
            <MarkUnseen />
          {:else}
            <MarkSeen />
          {/if}
          <Ripple />
        </div>

        {#if isJunk(mailbox)}
          <div 
            class="action btn-dark" 
            use:tooltip={$locale.This_is_not_spam}
            on:click={spam}  
          >
            <UnMarkSpam />
            <Ripple />
          </div>
        {:else if !isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox)}
          <div class="action btn-dark" use:tooltip={$locale.Mark_as_spam}
            on:click={spam}
          >
            <MarkSpam />
            <Ripple />
          </div>
        {/if}

        <div class="action btn-dark" use:tooltip={
            isTrash(mailbox) ? $locale.Delete_permanently :
            isDrafts(mailbox) ? $locale.Discard_drafts :
            $locale.Delete}
          on:click={del}  
        >
          <Delete />
          <Ripple />
        </div>
      </div>

      <div class="action-group">

        <div class="action-group">
          <div class="action btn-dark" use:tooltip={$locale.Forward} on:click={forward}>
            <Resend />
            <Ripple />
          </div>

          {#if !isDrafts(mailbox) && !isSent(mailbox)}
            <div class="action btn-dark" use:tooltip={$locale.Reply} on:click={reply}>
              <Reply />
              <Ripple />
            </div>
          {/if}
        </div>
      </div>

      <MoveTo {mailbox} onMove={move} />
        
      <Attachments {mailbox} {message} />

    </TabTop>

    <div class="message" on:scroll={onScroll} in:fly={{duration: 150, x: -20}}>

      <div class="detail">
        <div class="subject">{message.subject}</div>
        <div class="info">
          {#if message.from}
            <div class="from">
              {#if message.from.name}
                From: <span class="from-name">{message.from.name}</span> {"<"}{message.from.address}{">"}
              {:else}
                From: <span class="from-only-address">{message.from.address}</span>
              {/if}
            </div>
          {/if}
            
          {#if message.to}
            <div class="to">
              {$locale["To:"]}
              {#each message.to as to, i}
                {#if i !== 0}, {/if}
                <span class="to-address">{to.address}</span>
              {/each}
            </div>
          {/if}
            
          {#if message.date}
            <div class="date">
              {$locale["Sent:"]} {new Date(message.date).toLocaleString()}
            </div>
          {/if}
        </div>
      </div>

      <div class="body">
        {#if !html}
          <div class="text">
            {message.text || ""}
          </div>
        {:else}
          <div class="html" use:purify={{html, message}} />
        {/if}
      </div>
    </div>
  </div>

{/key}