<style>
  .anchor {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 1rem;
  }
</style>

<script>
  export let mailbox; // Writable<Mailbox>
  export let selection; // Writable<Writable<Message>[]>
  
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();

  import {mailboxMeta} from "lib@util.js";
  import {inbox, trash, junk, sent, drafts, others} from "lib@client/mailboxes.js";
  import {moveTo} from "lib@client/messages.js";
  import MoveTo from "svelte-material-icons/FolderMoveOutline.svelte";

  import {getContext} from "svelte";
  const {locale: l} = getContext("app");
  export let locale = $l;

  let folders = [];
  $: {
    if(mailbox === inbox) {
      folders = [
        ...$others,
        junk,
        trash,
      ].filter(m => m && !!m.get())
    } else if (mailbox === trash || mailbox === junk) {
      folders = [
        inbox,
        ...$others,
        mailbox !== trash && trash,
        mailbox !== junk && junk
      ].filter(m => m && !!m.get())
    } else if ($others.includes(mailbox)) {
      folders = [
        inbox,
        ...$others.filter(m => m !== mailbox)
      ].filter(m => m && !!m.get())
    } else {
      folders = [];
    }
  }

  let metas, ids;
  $: metas = folders.map(f => mailboxMeta(f.get(), $l.mailbox.title));
  $: ids = $selection.map(m => m.get().id);

  const to = (to) => {
    moveTo(mailbox.get().id, ids, to.get().id);
    dispatch("moved", {to, messages: $selection})
  }

  export let menuOpen = false;

  import {Ripple} from "svelte-mui";
  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte";
  import MenuItem from "comp@Menu/MenuItem.svelte";

  const toggle = () => menuOpen = !menuOpen;
</script>

{#if folders.length}
  <x-action class="btn-dark" class:hover={menuOpen} on:click={toggle} data-tooltip={locale.actions.moveTo}>
    <MoveTo/>
    <div class="anchor">
      <Popup anchor="top-left" bind:open={menuOpen}>
        <Menu>
          {#each folders as box, i}
            <MenuItem icon={metas[i].icon} on:click={() => to(box)}>
              {metas[i].label}
            </MenuItem>
          {/each}
        </Menu>
      </Popup>
    </div>
    <Ripple />
  </x-action>
{/if}