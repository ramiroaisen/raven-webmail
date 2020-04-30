<style>
  x-tab-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-bottom: 3em;
  }

  x-mailbox-empty {
    flex: none;
    margin: 2em auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 1.1em;
  }

  .label {
    font-weight: 500;
    margin-top: 1em;
  }

  .select {
    margin-inline-start: -0.15em;
  }

  .only-when-selection{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  x-selection-info {
    display: flex;
    flex: none;
    flex-direction: row-reverse;
    align-items: center;
    margin-inline-start: auto;
    background: #c2dbff;
    padding: 0.4em 0.5em;
    border-radius: 100px;
    color: #555;
  }
  
  x-selection-info > :global(svg) {
    font-size: 1.1em;
  }

  x-selection-info > span {
    font-size: 0.8em;
    margin: 0 0.5em;
  }

  x-loadmore {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pc);
    padding: 0.5em;
    font-size: 2.5em;
    min-height: auto;
  }

  x-loadmore-loading, x-loadmore-button {
    display: flex;
    flex: none;
    width: 1em;
    height: 1em;
    align-items: center;
    justify-content: center;
  }

  x-loadmore-button {
    cursor: pointer;
    border-radius: 50%;
  }

  x-mailbox-message {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    flex: none;
    justify-items: stretch;
    align-items: stretch;
    background: #fff;
    transition: opacity 150ms ease, margin 150ms ease;
  }

  x-tab-content > :global(.removed) {
    z-index: 1;
    margin-block-end: -3.0625rem;
    opacity: 0;
  }
</style>

<script>
  import {getContext, setContext, onMount} from "svelte";
  import {fade} from "svelte/transition";
  import {flip} from "svelte/animate";

  import {writable} from "../../../lib/store";

  import Item from "./MailboxMessage.svelte";
  import Tab from "../Main.svelte";
  import Topbar from "../ActionBar.svelte";

  //import EmptyFolder from "svelte-material-icons/FolderOpenOutline.svelte";

  import Refresh from "svelte-material-icons/Refresh.svelte";
  import Delete from "svelte-material-icons/DeleteOutline.svelte";
  import MarkUnSeen from "svelte-material-icons/EmailOutline.svelte";
  import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  import MarkSpam from "svelte-material-icons/AlertDecagramOutline.svelte";
  import UnMarkSpam from "svelte-material-icons/EmailCheckOutline.svelte";
  import Resend from "svelte-material-icons/EmailSendOutline.svelte";
  import Reply from "svelte-material-icons/EmailReceiveOutline.svelte";
  //import MoveTo from "svelte-material-icons/FolderMoveOutline.svelte";
  //import GoBack from "svelte-material-icons/ArrowLeft.svelte";  
  import CheckAll from "svelte-material-icons/CheckboxMarked.svelte";
  import CheckNone from "svelte-material-icons/CheckboxBlankOutline.svelte";
  import CheckSome from "svelte-material-icons/CheckboxIntermediate.svelte";

  import CheckCircle from "svelte-material-icons/CheckCircle.svelte";
  import Check from "svelte-material-icons/Check.svelte";

  import More from "svelte-material-icons/Plus.svelte";
  import CircularProgress from "../../CircularProgress.svelte";

  import {Ripple} from "svelte-mui";
  import MoveTo from "../MoveTo.svelte";

  export let mailbox;
  export let messages;
  export let next;
  export let prev;
  export let selection;
  export let scroll;

  setContext("mailbox-selection", selection);

  import {junk, trash, drafts, sent} from "../../../lib/client/mailboxes";
  import * as mess from "../../../lib/client/messages";

  let isJunk, isTrash, isDraft, isSent;
  $: isJunk = mailbox === junk;
  $: isTrash = mailbox === trash;
  $: isDraft = mailbox === drafts;
  $: isSent = mailbox === sent;

  const handleSelection = () => {
    selection.update($sel => {
      if($selection.length !== $messages.length) {
        return $messages.slice();
      } else {
        return [];
      }
    })
  }

  const onSelectionMoved = () => {
    const selected = selection.get();
    messages.update(ms => ms.filter(m => !selected.includes(m)));
    selection.clear();
    if(messages.get().length < 10) {
      loadMore();
    }
  } 
  

  const updateSeen = async (seen) => {
    if($selection.length) {
      $selection.forEach(m => m.update(m => ({...m, seen})))
      selection.invalidate();
      await mess.updateSeen($mailbox.id, $selection.map(i => i.get().id), seen)
    }
  }

  const markAsSpam = async (value) => {
    mess.markAsSpam($mailbox.id, $selection.map(i => i.get().id), value);
    onSelectionMoved();
  }

  const del = async () => {
    mess.del($mailbox.id, $selection.map(i => i.get().id));
    onSelectionMoved();
  }

  import {list} from "lib@client/messages.js";
  
  let reloading = false;
  let reloadTimes = 0;
  const reload = async () => {
    if (reloading)
      return;
    reloadTimes++;
    reloading = true;
    const json = await list($mailbox.id);
    messages.set(json.messages.map(m => writable(m)))
    prev.set(json.prev);
    next.set(json.next);
    selection.clear();
    reloading = false;
  }

  let loadingMore = false;
  const loadMore = async () => {
    if ( !$next )
      return;
    
    loadingMore = true;
    const res = await mess.next($mailbox.id, $next);
    messages.update(m => [...m, ...res.messages.map(m => writable(m))])
    next.set(res.next);
    prev.set(res.prev);
    loadingMore = false;
  }

  import {quadOut} from "svelte/easing";
  const flyInsert = (node, params) => {
    node.classList.add("removed");
    node.style.zIndex = "1";
    setTimeout(() => node.classList.remove("removed"), 1);
    setTimeout(() => node.style.zIndex = null, 150)
    return {duration: 150}
    /*
    return {
      easing: quadOut,
      ...params,
      css: (t, u) => `z-index: 1; opacity: ${t}; margin-block-end: -${u * h}px;`
    }
    */
  }

  const flyRemove = (node) => {
    node.classList.add("removed");
    return {duration: 150}
  }

  const {locale: l, trans} = getContext("app");
  export let locale = $l;

  import {mailboxMeta} from "../../../lib/util";
  let meta;
  $: meta = mailboxMeta($mailbox, locale.mailbox.title);
</script>

<svelte:head>
  <title>{$mailbox.unseen ? `(${$mailbox.unseen}) ` : ""}{meta.label}</title>
</svelte:head>

<Tab>
  <Topbar scrolled={$scroll !== 0}>

    <x-action-group class="select">
      <x-action class="btn-dark" data-tooltip={locale.actions.select} on:click={handleSelection}>
        <Ripple />
        {#if $selection.length === 0}
          <CheckNone />
        {:else if $selection.length === $messages.length}
          <CheckAll />
        {:else}
          <CheckSome />
        {/if}
      </x-action>

      <x-action class="btn-dark reload" data-tooltip={locale.actions.reload} on:click={reload}>
        <div style="display: flex; transition: transform 300ms ease; transform: rotate({360 * reloadTimes}deg)">
          <Refresh  />
        </div>
        <Ripple />
      </x-action>
    </x-action-group>

    {#if $selection.length !== 0}
      <div class="only-when-selection" transition:fade|local={{duration: 150}}>
        <x-action-group>
          {#if $selection.every(m => !m.get().seen)}
            <x-action  class="btn-dark" data-tooltip={locale.actions.markAsRead} on:click={() => updateSeen(true)}>
              <MarkSeen />
              <Ripple />
            </x-action>
          {:else}
            <x-action class="btn-dark" data-tooltip={locale.actions.markAsUnread} on:click={() => updateSeen(false)}>
              <MarkUnSeen />
              <Ripple />
            </x-action>
          {/if}

          {#if isJunk}
            <x-action class="btn-dark" data-tooltip={locale.actions.unMarkAsSpam} on:click={() => markAsSpam(false)}>
              <UnMarkSpam />
              <Ripple />
            </x-action>
          {:else if !isDraft && !isSent && !isTrash}
            <x-action class="btn-dark" data-tooltip={locale.actions.markAsSpam} on:click={() => markAsSpam(true)}>
              <MarkSpam />
              <Ripple />
            </x-action>
          {/if}

          <x-action class="btn-dark" data-tooltip={
              isTrash ? locale.actions.deletePermanently :
              isDraft ? locale.actions.discardDrafts :
              locale.actions.delete
          } on:click={() => del()}>
            <Delete />
            <Ripple />
          </x-action>
        </x-action-group>


        <x-action-group>
          <MoveTo {mailbox} {selection} on:moved={onSelectionMoved}/>
        </x-action-group>
  
        <x-selection-info>
          <Check />
          <span>{$trans("selection.title", {n: $selection.length})}</span>
        </x-selection-info>
      </div>
    {/if}

  </Topbar>
  
  <x-tab-content on:scroll={event => $scroll = event.target.scrollTop}>
    {#each $messages as message (`${$mailbox.id}-${message.get().id}`)}
        <x-mailbox-message out:flyRemove|local={{}} in:flyInsert|local={{duration: 150}}>
          <Item {message} {mailbox} />
        </x-mailbox-message>
    {:else}
      {#if !loadingMore}
        <x-mailbox-empty>
          <span class="label">{locale.mailbox.empty}</span>
        </x-mailbox-empty>
      {/if}
    {/each}
    
    {#if loadingMore || $next}
      <x-loadmore>
        {#if loadingMore}
          <x-loadmore-loading in:fade|local={{delay: 150, duration: 150}}>
            <CircularProgress size="0.75em"/>
          </x-loadmore-loading>
        {:else if $next}
          <x-loadmore-button in:fade|local={{delay: 150, duration: 150}} class="btn-dark" on:click={loadMore}>
            <More />
            <Ripple />
          </x-loadmore-button>
        {/if}
      </x-loadmore>
    {/if}
  </x-tab-content>
</Tab>