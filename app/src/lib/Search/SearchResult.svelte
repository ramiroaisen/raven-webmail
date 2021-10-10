<script lang="ts" context="module">
  const from = (mailbox: Mailbox, message: Message): string => {
    if(mailbox.specialUse === "\\Drafts" || mailbox.specialUse === "\\Sent") {
      return `To: ${message.to[0]?.name || message.to[0]?.address || ""}`;
    }

    return message.from.name || message.from.address || "";
  }  

  import { toString } from "diacritic-regex";
  const diac = toString();
</script>

<script lang="ts">
  export let query: string;
  export let mailbox: Mailbox;
  export let message: Message;
  export let selection: Message[] = [];

  $: selected = selection.some(m => m.mailbox === message.mailbox && m.id === message.id)

  const toggleSelection = () => {
    const v = selection.filter(m => m.id !== message.id);
    if(selected) selection = v;
    else selection = [...v, message];
  }

  import Ripple from "$lib/Ripple.svelte";
  import type { Message, Mailbox } from "$lib/types";

  import NotSelected from "svelte-material-icons/CheckboxBlankOutline.svelte";
  import Selected from "svelte-material-icons/CheckboxMarked.svelte";
  import NotFlagged from "svelte-material-icons/StarOutline.svelte";
  import Flagged from "svelte-material-icons/Star.svelte";
  import Paperclip from "svelte-material-icons/Paperclip.svelte";
  
  import { action, isDrafts, mailboxName, messageDate, _put } from "$lib/util";
  import { _open } from "$lib/Compose/compose";
  const flag = action(async () => {
    message.flagged = !message.flagged;
    await _put(`/api/mailboxes/${mailbox.id}/messages/${message.id}/flag`, {
      value: message.flagged
    }).catch(e => {
      message.flagged = !message.flagged;
      throw e;
    })
  })

  const click = action(async (event: MouseEvent) => {
    if(isDrafts(mailbox)) {
      event.preventDefault();
      event.stopPropagation();
      await _open(mailbox, message.id);
    }
  })

  import regexEscape from "regex-escape";

  const highlight = (node: HTMLElement, query: string) => {

    const src = node.textContent;

    const update = (query: string) => {
      
      const words = query.split(/\s+/g);
      
      if(words.length === 0) {
        node.textContent = src;
        return;
      }

      const regex = new RegExp(words.map(word => diac(regexEscape(word))).join("|"), "ig");

      const html = src.replace(regex, (match => {
        const span = document.createElement("span");
        span.textContent = match;
        span.classList.add("highlight");
        return span.outerHTML;
      }))
      
      node.innerHTML = html;
    }

    update(query);
    
    return { update }
  }
</script>

<style>
  .message {
    border-bottom: rgba(0,0,0,0.1) 1px solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.95rem;
  }

  .message:not(.seen) {
    font-weight: 600;
  }

  .cell-icon {
    box-sizing: border-box;
    border-radius: 100px;
    font-size: 1.25rem;
    display: flex;
    height: 3rem;
    width: 3rem;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .cell-icon:hover {
    z-index: 1;
  }

  .cell-icon + .cell-icon {
    margin-inline-start: -0.75rem;
  }

  .cell-icon:first-child {
    margin-inline-start: 0.5rem;
  }

  .selected {
    background-color: #c2dbff;
    border-bottom-color: #a5bad9;
  }

  .flag {
    transition: var(btn-transition), color 200ms ease;
  }

  .flagged > .flag {
    color: #e3c066;
  }

  .from {
    flex: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mailbox-subject-intro {
    flex: 6;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-inline-end: 1rem;
    margin-inline-start: 1rem;
  }

  .mailbox {
    flex: none;
    margin-inline-end: 0.5rem;
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 0.35rem;
    background: rgba(0,0,0,0.1);
    font-weight: 400;
  }

  .subject-intro {
    color: rgb(127, 127, 127);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subject {
    color: #000;
  }

  .intro {
    margin-inline-start: 1rem;
  }

  .date {
    flex: none;
    color: #555;
    font-size: 0.8rem;
    margin-inline-end: 1rem;
  }

  .flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  .date-attachments {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: none;
  }

  .attachments {
    display: flex;
    font-size: 1.25rem;
    margin-inline-end: 1rem;
    justify-self: flex-end;
    color: #555;
  }

  @media screen and (max-width: 650px) {
    .flex {
      flex-direction: column;
      align-items: flex-start;
      padding: 0.75rem 0;
    }
    
    .end {
      flex-direction: column;
      width: 100%;
    }

    .mailbox-subject-intro {
      margin-top: 0.5rem;
      margin-inline-start: 0;
      width: calc(100% - 1rem);
    }

    .date {
      margin-top: 0.5rem;
    }

    .select {
      margin-inline-start: 0 !important;
    }

    .date-attachments {
      align-self: stretch;
    }

    .attachments {
      margin-inline-start: auto;
      margin-top: 0.5rem;
      margin-bottom: -0.5rem;
    }
  }

  .end {
    flex: 7;
    display: flex;
    align-items: center;
  }

  .message :global(.highlight) {
    background: yellow;
  }
</style>

<a href="/mailbox/{mailbox.id}/message/{message.id}" 
  class="na message" 
  class:seen={message.seen} 
  class:selected 
  class:flagged={message.flagged}
  on:click={click}
>
  <div class="select cell-icon btn-dark" on:click|stopPropagation|preventDefault={toggleSelection}>
    {#if selected}
      <Selected />
    {:else}
      <NotSelected />
    {/if}
    <Ripple />
  </div>

  <div class="cell-icon btn-dark flag" on:click|stopPropagation|preventDefault={flag}>
    {#if message.flagged}
      <Flagged />
    {:else}
      <NotFlagged />
    {/if}
    <Ripple />
  </div>

  <div class="flex">
    <div class="from" use:highlight={query}>
      {from(mailbox, message)}
    </div>

    <div class="end">
      <div class="mailbox-subject-intro">
        <div class="mailbox">
          {mailboxName(mailbox)}
        </div>
        <div class="subject-intro">
          <span class="subject" use:highlight={query}>
            {message.subject || ""}
          </span>
          <span class="intro" use:highlight={query}>
            {message.intro || ""}
          </span>
        </div>
      </div>

      <div class="date-attachments">
        <div class="date">
          {messageDate(message.date)}
        </div>
    
        {#if message.attachments}
          <div class="attachments">
            <Paperclip />
          </div>
        {/if}
      </div>
    </div>
  </div>
  </a>