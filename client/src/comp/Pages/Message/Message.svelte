<style>
  x-tab-content {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 2em 3em;
  }

  x-message-title {
    font-size: 1.5em;
    font-weight: 600;
    min-height: auto;
    word-break: break-word;
  }

  x-message-content {
    margin-top: 3em;
    min-height: auto;
    margin-bottom: 2em;
  }

  x-message-content :global(a) {
    color: blue;
    text-decoration: underline;
  }

  x-message-content :global(a:visited) {
    color: blueviolet;
  }
  
  x-message-info {
    flex: none;
    display: flex;
    flex-direction: column;
    margin-top: 2em;
  }

  x-message-from, x-message-to, x-message-date {
    padding: 0.25em 0;
  }

  x-message-content {
    flex-grow: 1;
  }

  .from-main{
    font-weight: 600;
  }
  
</style>

<script>
  import {writable} from "../../../lib/store";
  import {getContext} from "svelte";

  import Tab from "../Main.svelte";
  import Topbar from "../ActionBar.svelte";
  //import Content from "/comp/Tab/Content.svelte";

  import Delete from "svelte-material-icons/DeleteOutline.svelte";
  import MarkUnseen from "svelte-material-icons/EmailOutline.svelte";
  //import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  //import MarkUnseen from "svelte-material-icons/EmailMultipleOutline.svelte";
  //import MarkUnseen from "svelte-material-icons/EmailMarkAsUnread.svelte";
  import MarkSeen from "svelte-material-icons/EmailOpenOutline.svelte";
  import MarkSpam from "svelte-material-icons/AlertDecagramOutline.svelte";
  import UnMarkSpam from "svelte-material-icons/EmailCheckOutline.svelte";
  import Resend from "svelte-material-icons/EmailSendOutline.svelte";
  import Reply from "svelte-material-icons/EmailReceiveOutline.svelte";
  import GoBack from "svelte-material-icons/ArrowLeft.svelte";

  import {Ripple} from "svelte-mui";

  import {sanitize} from "../../../lib/sanitize";

  import {create} from "../../Compose/compose";
  
  export let mailbox;
  export let message;
  export let scroll;

  const handleScroll = e => scroll.set(e.target.scrollTop);

  import * as messages from "../../../lib/client/messages"
  import * as mailboxes from "../../../lib/client/mailboxes"

  let isJunk = mailboxes.junk === mailbox;
  let isTrash = mailboxes.trash === mailbox;
  let isDraft = mailboxes.drafts === mailbox;
  let isSent = mailboxes.sent === mailbox;

  const onetime = fn => {
    let updating = false;
    return async () => {
      if (updating) return;
      updating = true;
      try {
        await fn();
      } catch(e) {
        throw e;
      } finally {
        updating = false;
      }
    }
  }

  const seen = onetime(async () => {
    await messages.updateSeen($mailbox.id, [$message.id], !$message.seen);
    message.update(m => ({...m, seen: !m.seen}))
  })

  const spam = onetime(async () => {
    await messages.markAsSpam($mailbox.id, [$message.id], !isJunk);
    location.hash = `#!/mailbox/${$mailbox.id}`;
  })

  const del = onetime(async () => {
    await messages.del($mailbox.id, [$message.id]);
    location.hash = `#!/mailbox/${$mailbox.id}`;
  })

  const reply = onetime(async () => {
    const $draft = await messages.createReply($mailbox.id, $message.id);
    create(writable($draft));
  })

  const forward = onetime(async () => {
    const $draft = await messages.createForward($mailbox.id, $message.id);
    create(writable($draft));
  })

  import MoveTo from "../MoveTo.svelte";
  const gotoBox = () => setTimeout((() => location.hash = `#!/mailbox/${$mailbox.id}`), 250);

  import Attachments from "comp@Attachments/Attachments.svelte";

  const {locale: l} = getContext("app");
  export let locale = $l;
</script>

<svelte:head>
  <title>{$message.subject}</title>
</svelte:head>

<Tab>
  <Topbar scrolled={$scroll !== 0}>
    <x-action-group>
      <a class="x-action btn-dark" href="#!/mailbox/{$mailbox.id}" data-tooltip={locale.actions.backToMailbox}>
        <GoBack />
        <Ripple />
      </a>
    </x-action-group>

    <x-action-group>
      <x-action 
        class="btn-dark"
        data-tooltip={$message.seen ? locale.actions.markAsUnread : locale.actions.markAsRead}
        on:click={seen}
      >
        <Ripple />
        {#if $message.seen}
          <MarkUnseen />
        {:else}
          <MarkSeen />
        {/if}
      </x-action>

      {#if isJunk}
        <x-action class="btn-dark" data-tooltip={locale.actions.unMarkAsSpam} on:click={spam}>
          <UnMarkSpam />
          <Ripple />
        </x-action>
      {:else if !isDraft && !isSent && !isTrash}
        <x-action class="btn-dark" data-tooltip={locale.actions.markAsSpam} on:click={spam}>
          <MarkSpam />
          <Ripple />
        </x-action>
      {/if}

      <x-action class="btn-dark" data-tooltip={
          isTrash ? locale.actions.deletePermanently :
          isDraft ? locale.actions.discardDrafts :
          locale.actions.delete
      } on:click={del}>
        <Delete />
        <Ripple />
      </x-action>
    </x-action-group>

    <x-action-group>
      <x-action class="btn-dark" data-tooltip={locale.actions.forward} on:click={forward}>
        <Resend />
        <Ripple />
      </x-action>

      {#if !isDraft && !isSent}
        <x-action class="btn-dark" data-tooltip={locale.actions.reply} on:click={reply}>
          <Reply />
          <Ripple />
        </x-action>
      {/if}
    </x-action-group>

    <x-action-group>
      <MoveTo {mailbox} selection={writable([message])} on:moved={gotoBox} tooltip={locale.actions.moveTo} />
    </x-action-group>

    {#if $message.attachments && $message.attachments.length}
      <x-action-group>
        <Attachments {mailbox} {message} attachments={$message.attachments} tooltip={locale.actions.attachments} />
      </x-action-group>
    {/if}
  </Topbar>

  <x-tab-content on:scroll={handleScroll}>
    <x-message-title>{$message.subject}</x-message-title>
    <x-message-info>

      {#if $message.from}
        <x-message-from>       
          {#if $message.from.name}
            {locale.message.labels.from}
            <span class="from-main">{$message.from.name}</span>
            {"<"}{$message.from.address}{">"}
          {:else}
            {locale.message.labels.from}
            <span class="from-main">
              {$message.from.address} 
            </span>
          {/if}
        </x-message-from>
      {/if}
      
      {#if $message.to}
        <x-message-to>
          {locale.message.labels.to} {$message.to.map(to => {
              return `<${to.address}>`
            }).join(", ")}
        </x-message-to>
      {/if}
      
      {#if $message.date}
        <x-message-date>
          {locale.message.labels.date} {new Date($message.date).toLocaleString()}
        </x-message-date>
      {/if}
    </x-message-info>

    <x-message-content>
      {#if $message.html && $message.html.length}
        {@html sanitize($message.html.join(""))}
      {:else if $message.text && $message.text.trim()}
        <pre>{$message.text}</pre>
      {/if}
    </x-message-content>

  </x-tab-content>
</Tab>