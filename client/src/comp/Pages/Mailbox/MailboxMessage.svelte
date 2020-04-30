<style>
  .message {
    font: inherit;
    text-decoration: none;
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top:#d8dcdf 1px solid;
    padding: 0.25em 1em;
  }

  .show-hover {
    display: none !important;
  }

  .message:hover .show-hover {
    display: flex !important;
  }

  .message:hover .hide-hover {
    display: none;
  }



  .message:last-of-type {
    border-bottom: #d8dcdf 1px solid;
  }
  
  .message:last-of-type.selected {
    border-bottom-color: #a5bad9;
  }

  .message:first-child {
    border-top: none;
  }
  
  .selected {
    background-color: #c2dbff;
    border-bottom-color: #a5bad9; 
    border-top-color: #a5bad9; 
  }

  .selected + .message {
    border-top-color: #a5bad9;
  }

  x-cell {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 2em;
    height: 2em;
    font-size: 1.25em;
    cursor: pointer;
    border-radius: 50%;
    transition: color 200ms ease;
  }

  .icon > :global(svg) {
    position: absolute;
  }

  .flagged {
    color: #e3c066;
  }
  
  .from {
    padding: 0 1em;
    flex: 2;
  }

  .subject-intro {
    flex: 6;
  }

  .intro {
    opacity: 0.5;
    margin-inline-start: 0.5em;
  }

  .date {
    text-align: end;
    opacity: 0.5;
    /*text-transform: capitalize;*/
    flex: none;
    margin-inline-start: 1em;
    font-size: 0.8em;
  }

  .unseen {
    font-weight: 700;
  }

  .from-subject-date {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  @media screen and (max-width: 700px) {

    .message {
      padding-inline-start: 0.45em;
    }

    .cell-selected {
      margin-inline-end: -0.45em;
    }

    .from-subject-date {
      flex-direction: column;
      overflow: hidden;
      margin-inline-start: 0.5em;
      padding-top: 0.25em;
      padding-bottom: 0.25em;
    }

   .from-subject-date > x-cell{
      padding: 0;
    }

    .from-subject-date > x-cell + x-cell{
      margin-top: 0.35em;
    }

    .from {
      align-self: flex-start;
      margin: 0;
    }

    .subject-intro {
      align-self: flex-start;
      flex: none;
      width: 100%;
    }

    .date {
      align-self: flex-start;
      margin: 0;
    }
  }
</style>

<script>
  import {writable} from "lib@store.js";
  import {slide, fly} from "svelte/transition";

  import UnFlagged from "svelte-material-icons/StarOutline.svelte";
  import Flagged from "svelte-material-icons/Star.svelte";

  import On from "svelte-material-icons/CheckboxBlankOutline.svelte";
  import Off from "svelte-material-icons/CheckboxMarked.svelte";

  import {Ripple} from "svelte-mui";

  import {getContext, onDestroy} from "svelte";
  const selection = getContext("mailbox-selection");
  const {isSelected, add, remove, toggle} = selection;

  import {create} from "comp@Compose/compose.js";

  import {drafts, sent} from "lib@client/mailboxes.js";
  import * as mess from "lib@client/messages.js";

  export let message;
  export let mailbox;

  let isDraft, isSent, selected;
  $: isDraft = mailbox === drafts;
  $: isSent = mailbox === sent;
  $: selected = $isSelected(message);

  const flag = e => {
    mess.flag($mailbox.id, [$message.id], !$message.flagged);
    message.update(m => ({...m, flagged: !m.flagged}))
  }

  let unsub;

  const click = async e => {
    if (isDraft) {
      e.preventDefault();
      if ( !$message.seen ) {
        //mess.updateSeen($mailbox.id, [$message.id], true)
        message.update(m => ({...m, seen: true}));
      }
      
      const $draft = await mess.getDraft($message.id);
      const draft = writable($draft);
      unsub = draft.subscribe(d => {
        message.update(m => ({...m, ...d}))
      })
      
      create(draft)
    }
  }

  onDestroy(() => unsub && unsub())

  import {date} from "lib@formatter.js";

  const {locale: l} = getContext("app");
  export let locale = $l;
</script>

<a href="#!/mailbox/{$mailbox.id}/message/{$message.id}" class="na message" class:selected class:unseen={!$message.seen} on:click={click}>
  <x-cell class="btn-dark icon cell-selected" on:click|preventDefault|stopPropagation={() => toggle(message)}>
    {#if selected}
      <Off />
    {:else}
      <On />
    {/if}
    <Ripple />
  </x-cell>


  <x-cell class="btn-dark icon" class:flagged={$message.flagged} on:click|preventDefault|stopPropagation={flag}>
    {#if $message.flagged}
      <Flagged />
    {:else}
      <UnFlagged />
    {/if}
    <Ripple />
  </x-cell>

  <x-cell-group class="from-subject-date">
    <x-cell class="from">
      {#if isSent || isDraft}
        <span class="for">{locale.mailboxMessage.to} </span>{($message.to || []).map(to => to.name || to.address).filter(Boolean).join(", ")}
      {:else}
        {$message.from.name || $message.from.address || ""}
      {/if}
    </x-cell>


    <x-cell class="subject-intro">
      <span class="subject">{$message.subject || ""}</span>
      <span class="intro">{$message.intro || ""}</span>
    </x-cell>


    <x-cell class="date">
      {$message.date && date($message.date, locale)}
    </x-cell>
  </x-cell-group>
</a>