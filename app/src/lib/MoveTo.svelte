<style>
  .anchor {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>

<script lang="ts">
  export let mailbox: Mailbox;
  export let onMove: (mailbox: Mailbox) => void = () => {}
  export let open = false;

  import type { Mailbox } from "./types";
  import type { DashContext } from "./Dashboard/Dashboard.svelte";

  const { mailboxes } = getContext("dash") as DashContext;

  $: inbox = $mailboxes.find(isInbox)!;
  $: trash = $mailboxes.find(isTrash)!;
  $: junk = $mailboxes.find(isJunk)!;
  $: sent = $mailboxes.find(isSent)!;
  $: others = $mailboxes.filter(item => {
    return item !== inbox && item.specialUse == null;
  })!;

  let folders: Mailbox[] = [];
  $: {
    if(mailbox.id === inbox.id) {
      folders = [
        ...others,
        junk,
        trash,
      ];
    } else if (mailbox.id === trash.id) {
      folders = [
        inbox,
        ...others,
        junk
      ]
    } else if(mailbox.id === junk.id) {
      folders = [
        inbox,
        ...others,
        trash
      ]
    } else if(mailbox.id === sent.id) {
      folders = [
        trash
      ]
    } else if (others.some(item => item.id === mailbox.id)) {
      folders = [
        inbox,
        ...others.filter(item => item.id !== mailbox.id),
        junk,
        trash,
      ]
    }
  }


  import MoveTo from "svelte-material-icons/FolderMoveOutline.svelte";
  import PortalPopup from "./PortalPopup.svelte";
  import { isJunk, isTrash, isInbox, mailboxIcon, mailboxName, isSent } from "./util";
  import { getContext } from "svelte";
  import Ripple from "./Ripple.svelte";
  import { tooltip } from "./actions";
  import Menu from "./Menu/Menu.svelte";
  import MenuItem from "./Menu/MenuItem.svelte";
import { locale } from "./locale";
</script>

{#if folders.length}
  <div class="action-group">
    <div class="action btn-dark" class:hover={open} on:click={() => open = !open} use:tooltip={$locale.Move_to}>
      <MoveTo/>
      <div class="anchor">
        <PortalPopup anchor="top-left" bind:open>
          <Menu>
            {#each folders as mailbox}
              <MenuItem icon={mailboxIcon(mailbox)} on:click={() => onMove(mailbox)}>
                {mailboxName(mailbox)}
              </MenuItem>
            {/each}
          </Menu>
        </PortalPopup>
      </div>
      <Ripple />
    </div>
  </div>
{/if}