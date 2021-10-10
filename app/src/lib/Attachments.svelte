<script lang="ts">
  export let mailbox: Mailbox;
  export let message: FullMessage;
  export let open = false;

  import type { Mailbox, FullMessage } from "./types";

  import Paperclip from "svelte-material-icons/Paperclip.svelte";
  import { url } from "$lib/fileIcons";

  import PortalPopup from "$lib/PortalPopup.svelte";
  import Menu from "$lib/Menu/Menu.svelte";
  import { tooltip } from "./actions";
  import Ripple from "./Ripple.svelte";
import { locale } from "./locale";
</script>

<style>
  .anchor {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .count {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    font-size: 0.6em;
    color: #fff;
    font-weight: 600;
    background: var(--red);
    border-radius: 50%;
    width: 1.4em;
    height: 1.4em;
    line-height: 1.4em;
    text-align: center;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    height: 2.5rem;
  }

  .img {
    width: 2rem;
    height: 2rem;
    margin-inline-start: 0.5rem;
  }

  .name {
    margin-inline-start: 1rem;
    margin-inline-end: 1rem;
  }
</style>

{#if message.attachments?.length}
  <div class="action-group">
    <div class="action btn-dark" class:hover={open} use:tooltip={$locale.Attachments} on:click={() => open = !open}>
      <Paperclip/>
      <div class="count">{message.attachments.length}</div>
      <div class="anchor">
        <PortalPopup anchor="top-left" bind:open>
          <Menu>
            {#each message.attachments as attach}
              <a href="/api/mailboxes/{mailbox.id}/messages/{message.id}/attachments/{attach.id}"
                class="na item btn-dark"
                download={attach.filename}>
                <div class="img" style="background-image: url({url(attach.filename)})" />
                <div class="name">
                  {attach.filename}
                </div>
                <Ripple />
              </a>
            {/each}
          </Menu>
        </PortalPopup>
      </div>
      <Ripple/>
    </div>
  </div>
{/if}