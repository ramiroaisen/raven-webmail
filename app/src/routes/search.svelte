<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";
  import { getPage } from "$lib/util";
  export const load: Load = async ({ page, fetch, session }) => {
    // @ts-ignore
    return await getPage({ page, fetch, session });
  };
</script>

<script lang="ts">
  export let query: string;
  //export let success: true;
  export let results: Message[];
  export let nextCursor: string | null;
  //export let prevCursor: string | null;
  //export let page: number;
  export let total: number;

  let selection: Message[] = [];
  let scrolled = false;

  import type { DashContext } from "$lib/Dashboard/Dashboard.svelte";
  import type { Mailbox, Message } from "$lib/types";

  import { getContext } from "svelte";
  const { mailboxes } = getContext("dash") as DashContext;

  const map = (mailboxes: Mailbox[]) => {
    const map = new Map<string, Mailbox>();
    for(const box of mailboxes) {
      map.set(box.id, box);
    }
    return map;
  }

  $: mailboxMap = map($mailboxes);

  import { add, tooltip } from "$lib/actions";
  
  const dedup = (messages: Message[]) => {
    const target: Message[] = [];
    for(const item of messages) {
      if(!target.some(m => m.mailbox === item.mailbox && m.id === item.id)) {
        target.push(item);
      }
    }
    return target;
  }

  let loadingMore = false;
  const next = action(async () => {
    if(!nextCursor) return;
    loadingMore = true;
    try {
      const json = await _get(`/api/search?next=${nextCursor}&limit=50`);
      results = dedup([...results, ...json.results]);
      nextCursor = json.nextCursor;
      loadingMore = false;
    } catch(e) {
      loadingMore = false;
      throw e;
    }
  })

  const prev = action(async () => {
    await goto(`/search?query=${encodeURIComponent(query)}&now=${Date.now()}`, { replaceState: true, keepfocus: true });
  });

  const context: MailboxContext = { next, prev };
  setContext("search", context);

  import Plus from "svelte-material-icons/Plus.svelte";
  import Ripple from "$lib/Ripple.svelte";
  import { action, _get } from "$lib/util";
  import CircularProgress from "$lib/CircularProgress.svelte";

  import { cubicOut } from "svelte/easing";
  import { setContext } from "svelte/internal";
  import { fly } from "svelte/transition";
  import SearchResult from "$lib/Search/SearchResult.svelte";
  import SearchTop from "$lib/Search/SearchTop.svelte";
  import { goto } from "$app/navigation";
  import type { MailboxContext } from "$lib/Mailbox/Mailbox.svelte";
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

  const scroll = (node: HTMLElement) => {
    return {
      destroy: add(node, "scroll", () => {
        scrolled = node.scrollTop !== 0;
      }, { passive: true })
    }
  }
</script>

<svelte:head>
  <title>{query}</title>
</svelte:head>

<style>
  .search {
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

{#key query}
  <div class="search">
    <SearchTop bind:results bind:selection {scrolled} {total} {mailboxMap} />
    <div class="content" in:fly={{ duration: 150, y: -15 }} use:scroll>
      {#if results.length || loadingMore}
        <div class="messages" transition:customSlide|local={{ duration: 250 }}>
          {#each results as message (`${message.mailbox}-${message.id}`)}
            <div class="message" transition:customSlide|local={{ duration: 250 }}>
              <SearchResult bind:message mailbox={mailboxMap.get(message.mailbox)} bind:selection {query} />
            </div>
          {/each}
        </div>
        <div class="next-wrap">
          {#if loadingMore}
            <div class="loading-more">
              <CircularProgress />
            </div>
          {:else if nextCursor}
            <div class="next btn-dark" on:click={next}>
              <Plus />
              <Ripple />
            </div>
          {/if}
        </div>
      {:else}
        <div class="empty-wrap" in:customSlide|local={{duration: 250}}>
          <div class="empty">
            {$locale.There_are_no_search_results_for_this_query}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/key}