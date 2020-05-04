<style>
  x-mailbox-list {
    display: flex;
    flex-direction: column;
    padding-top: 0.5em;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

<script>
  import {inbox, sent, drafts, junk, trash, others} from "../../../lib/client/mailboxes";
  import MailboxItem from "./MailboxItem.svelte"
</script>

<x-mailbox-list>
  {#if $inbox}
    <MailboxItem mailbox={inbox} />
  {/if}
  {#each $others as mailbox} 
    <MailboxItem {mailbox} />
  {/each}
  {#if $sent}
    <MailboxItem mailbox={sent} />
  {/if}
  {#if $drafts}
    <MailboxItem mailbox={drafts} />
  {/if}
  {#if $junk}
    <MailboxItem mailbox={junk} />
  {/if}
  {#if $trash}
    <MailboxItem mailbox={trash} />
  {/if}
</x-mailbox-list>