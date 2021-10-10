<script lang="ts">
  export let mailbox: Mailbox;

  import type { Mailbox } from "$lib/types";
  import { action, isDrafts, isInbox, isNarrow, isSent, isTrash, mailboxIcon, mailboxIsDeletable, mailboxName, _delete, _post, _put } from "../util";

  import Ripple from "$lib/Ripple.svelte";
  import { getContext } from "svelte";

  import type { DashContext } from "./Dashboard.svelte";
  import { scale, slide } from "svelte/transition";
  import Menu from "$lib/Menu/Menu.svelte";
  import MenuItem from "$lib/Menu/MenuItem.svelte";
  const { reloadMailboxes, mailboxes, drawerOpen: { narrow } } = getContext("dash") as DashContext;

  import Dots from "svelte-material-icons/DotsVertical.svelte";
  import PortalPopup from "$lib/PortalPopup.svelte";
  import Dialog from "$lib/Dialog.svelte";
  import { _error, _message } from "$lib/Notify/notify";

  const click = () => {
    if(isNarrow()) narrow.set(false);  
  }

  let hover = false;
  let menuOpen = false;

  let deleteOpen = false;
  
  import { page } from "$app/stores";

  const del = action(async () => {
    await _delete(`/api/mailboxes/${mailbox.id}`)
    deleteOpen = false;
    _message($locale.notifier.Folder_deleted);
    if($page.params.mailbox === mailbox.id) {
      goto(`/`);
    }
    await reloadMailboxes();
  })

  import { portal } from "../actions";
  import TextField from "$lib/TextField.svelte";
  import { goto } from "$app/navigation";

  let renameOpen = false;
  let renamePath = mailbox.path;
  const rename = action(async () => {
    await _put(`/api/mailboxes/${mailbox.id}`, { path: renamePath })
    _message($locale.notifier.Folder_renamed);
    renameOpen = false;
    await reloadMailboxes();
  })

  let clearOpen = false;
  const clear = action(async () => {
    if(isTrash(mailbox) || isDrafts(mailbox)) {
      _delete(`/api/mailboxes/${mailbox.id}/messages`)
        .then(() => {
          _message($locale.notifier.All_messages_deleted);
        }).catch(e =>  {
          _error(e?.message)
        })
    } else {
      const trash = $mailboxes.find(isTrash);
      if(trash == null) {
        throw new Error("Cannot find Trash folder");
      }
      _put(`/api/mailboxes/${mailbox.id}/messages`, {
        message: `1:${Number.MAX_SAFE_INTEGER}`,
        moveTo: trash.id,
      }).then(() => {
        _message($locale.notifier.All_messages_deleted);
      }).catch(e => {
        _error(e?.message);
      })
    }

    clearOpen = false;
    if(mailbox.total > 50) _message($locale.notifier.Deleting_process);
  })

  import FolderEdit from "svelte-material-icons/FolderEditOutline.svelte";
  import FolderDelete from "svelte-material-icons/FolderRemoveOutline.svelte";
  import FolderClear from "svelte-material-icons/DeleteOutline.svelte";
import { locale } from "$lib/locale";
</script>

<style>
  .portal {
    width: 0;
    height: 0;
  }

  .mailbox {
    position: relative;
    padding: 1rem 0.75rem 1rem 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  .mailbox.menu-open {
    z-index: 100;
  }

  .mailbox.current {
    background: rgba(0,0,0,0.1);
  }

 .icon {
    margin-inline-end: 1rem;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  }

  .menu-out {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    display: flex;
    transform: translateY(-50%);
  }

  .menu-in {
    position: relative;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.3rem;
    border-radius: 50%;
  }

  .anchor {
    position: fixed;
    top: var(--scroll-top);
    margin-top: 2.5rem;
    bottom: 0;
    left: 0;
  }

  .counter {
    position: absolute;
    right: 1rem;
    top: 50%;
    font-size: 0.85em;
    transform: translateY(-50%);
    pointer-events: none;
    color: #444;
    font-weight: 500;
  }

  .delete-body, .rename-body, .clear-body {
    display: flex;
    flex-direction: column;
  }

  .delete-label, .clear-label {
    margin-bottom: 1.5rem;
  }

  .delete-confirm, .clear-confirm {
    margin-inline-start: auto;
  }

  .rename-confirm {
    margin-top: 1.5rem;
    margin-inline-start: auto;
  }

</style>

<a 
  href="/mailbox/{mailbox.id}" 
  class="mailbox na btn-dark"
  class:current={$page.path.startsWith(`/mailbox/${mailbox.id}`)} 
  class:menu-open={menuOpen}
  on:click={click}
  on:mouseenter={() => hover = true}
  on:mouseleave={() => hover = false}
  transition:slide|local={{duration: 200}}
>
  <div class="icon">
    <svelte:component this={mailboxIcon(mailbox)} />
  </div>
  <div class="name">
    {mailboxName(mailbox)}
  </div>
  {#if hover || menuOpen} 
    <div class="menu-out" transition:scale|local={{ duration: 200 }}>
      <div class="menu-in">
        <div class="menu-btn btn-dark" class:hover={menuOpen} on:click|preventDefault|stopPropagation={() => menuOpen = !menuOpen}>
          <Dots />
          <Ripple />
        </div>
        <div class="anchor">
          <PortalPopup anchor="top-left" bind:open={menuOpen}>
            <Menu>
              {#if mailboxIsDeletable(mailbox)}
                <MenuItem icon={FolderEdit} on:click={() => renameOpen = true}>{$locale.Rename_folder}</MenuItem>
                <MenuItem icon={FolderClear} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>
                <MenuItem icon={FolderDelete} on:click={() => deleteOpen = true}>{$locale.Delete_folder}</MenuItem>
              {:else}
                <MenuItem icon={FolderClear} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>
              {/if}
            </Menu>
          </PortalPopup>
        </div>
      </div>
    </div>
  {:else if mailbox.unseen}
    <div class="counter" transition:scale|local={{ duration: 200 }}>
      {mailbox.unseen}
    </div>
  {/if}
  <Ripple />
</a>

<div class="portal" use:portal>
  {#if deleteOpen}
    <Dialog title="{$locale.Delete_folder} {mailboxName(mailbox)}" width="550px" onClose={() => deleteOpen = false}>
      <div class="delete-body">
        <div class="delete-label">{$locale.This_action_is_permanent_all_messages_will_be_deleted}</div>
        <button class="delete-confirm btn-light btn-primary elev2" on:click={del}>
          {$locale.Delete_folder}
        </button>
      </div>
    </Dialog>
  {/if}

  {#if renameOpen}
    <Dialog title="{$locale.Rename_folder} {mailboxName(mailbox)}" width="550px" onClose={() => renameOpen = false}>
      <div class="rename-body">
        <TextField validate required trim bind:value={renamePath} />
        <button class="rename-confirm btn-light btn-primary elev2" on:click={rename}>
          {$locale.Rename_folder}
        </button>
      </div>
    </Dialog>
  {/if}

  {#if clearOpen}
    <Dialog title="{$locale.Delete_all_messages} {$locale.of} {mailboxName(mailbox)}" width="550px" onClose={() => clearOpen = false}>
      <div class="clear-body">
        <div class="clear-label">
          {$locale.This_action_will_delete_all_messages_in_the_folder}
        </div>
        <button class="clear-confirm btn-light btn-primary elev2" on:click={clear}>
          {$locale.Delete_all_messages}
        </button>
      </div>
    </Dialog>
  {/if}
</div>