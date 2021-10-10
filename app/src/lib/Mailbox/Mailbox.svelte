<script lang="ts" context="module">
  export type MailboxContext = {
    next: () => Promise<void>,
    prev: () => Promise<void>,
  };
</script>

<script lang="ts">
  export let mailbox: Mailbox;
  export let messages: Messages;
  export let selection: TMessage[] = [];
  let scrolled = false;

  import type { Mailbox, Messages, Message as TMessage } from "$lib/types";
  import { add, tooltip } from "$lib/actions";
  import { Counters, Exists, Expunge } from "$lib/events";

  import { onMount, setContext } from "svelte";
  import Message from "./Message.svelte";
  import Top from "./Top.svelte";
      
  let loadingMore = false;
  const next = action(async () => {
    if(!messages.nextCursor) return;
    loadingMore = true;
    try {
      const json: Messages = await _get(`/api/mailboxes/${mailbox.id}/messages?next=${messages.nextCursor}&limit=50`)
      messages = {
        ...messages,
        results: dedup([ ...messages.results, ...json.results ]),
        nextCursor: json.nextCursor,
      }
      loadingMore = false;
    } catch(e) {
      loadingMore = false;
      throw e;
    }
  })

  const prev = action(async () => {
    const json: Messages = await _get(`/api/mailboxes/${mailbox.id}/messages`);
    messages = {
      ...messages,
      results: dedup([ ...json.results, ...messages.results ])
    }
  })

  const context: MailboxContext = { next, prev };
  setContext("mailbox", context);

  const scroll = (node: HTMLElement) => {
    return {
      destroy: add(node, "scroll", () => {
        scrolled = node.scrollTop !== 0;
      }, { passive: true })
    }
  }

  onMount(() => Counters.on(event => {
    if(event.mailbox === mailbox.id) {
      mailbox.unseen = event.unseen;
      mailbox.total = event.total;
    }
  }))

  import Plus from "svelte-material-icons/Plus.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { action, _get } from "$lib/util";
  import CircularProgress from "$lib/CircularProgress.svelte";

  const dedup = (messages: TMessage[]) => {
    const helper: TMessage[] = [];
    for(const item of messages) {
      if(helper.every(it => it.id !== item.id)) {
        helper.push(item);
      }
    }

    return helper;
  }

  onMount(() => {
    
    let timer: any;
    let timer2: any;
    let timer3: any;
    let rids: number[] = []
    
    const removeIds = () => {
      if(messages.results.some(item => rids.includes(item.id))) {
        messages = {
          ...messages,
          results: messages.results.filter(item => !rids.includes(item.id)),
        };

        selection = selection.filter(item => !rids.includes(item.id))
      }
      if(messages.results.length < 15) {
        clearTimeout(timer3);
        timer3 = setTimeout(next, 500);
      }
      rids = [];
    }

    const off = [
      
      Exists.on(event => {
        if(event.mailbox === mailbox.id) {
          clearTimeout(timer);
          timer = setTimeout(prev, 500);
        } 
      }),

      Expunge.on(event => {
        if(event.mailbox === mailbox.id && event.uid != null) {
          rids.push(event.uid);
          clearTimeout(timer2);
          timer2 = setTimeout(removeIds, 250)
        }
      }) 
    ]
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      run_all(off);
    }
  })

  import { cubicOut } from "svelte/easing";
  import { run_all } from "svelte/internal";
  import { fly } from "svelte/transition";
import { locale } from "$lib/locale";

  const customSlide = (node: HTMLElement, { delay = 0, duration = 400, easing = cubicOut } = {}) => {
    const height = node.getBoundingClientRect().height;
    return {
        delay,
        duration,
        easing,
        css: (t: number, u: number) => 
            'box-sizing: border-box' +
            'overflow: hidden;' +
            `opacity: ${t};` +
            `height: ${t * height}px;`
    }
  }
</script>

<style>
  .mailbox {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 6rem;
  }
  
  .empty {
    flex: none;
    margin: 3rem auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 1rem;
  }

  .next-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .next {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--red);
    font-size: 2rem;
    border-radius: 50%; 
    padding: 1rem;
    margin-top: 0.5rem;
  }

  .loading-more{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    border-radius: 50%; 
    padding: 1rem;
    margin-top: 0.5rem;
  }
</style>

<div class="mailbox">
  <Top {mailbox} bind:messages bind:selection bind:loadingMore {scrolled} />
  <div class="content" use:scroll in:fly={{ duration: 150, y: -15 }}>
    {#if messages.results.length || loadingMore}
      <div class="messages" transition:customSlide|local={{ duration: 250 }}>
        {#each messages.results as message (message.id)}
          <div class="message" transition:customSlide|local={{ duration: 250 }}>
            <Message bind:message {mailbox} bind:selection />
          </div>
        {/each}
      </div>
      <div class="next-wrap">
        {#if loadingMore}
          <div class="loading-more">
            <CircularProgress />
          </div>
        {:else if messages.nextCursor}
          <div class="next btn-dark" on:click={next}>
            <Plus />
            <Ripple />
          </div>
        {/if}
      </div>
    {:else}
      <div class="empty-wrap" in:customSlide|local={{duration: 250}}>
        <div class="empty">
          {$locale.This_mailbox_is_empty}
        </div>
      </div>
    {/if}
  </div>
</div>