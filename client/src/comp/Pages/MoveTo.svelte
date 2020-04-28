<style>
  x-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline-end: 3em;
  }

  x-icon {
    font-size: 1.25em;
    margin-inline-end: 0.8em;
    display: flex;
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
  import {Menuitem, Ripple} from "svelte-mui";
  import Menu from "svelte-mui/src/Menu.svelte";

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
        $others.filter(m => m !== mailbox)
      ].filter(m => m && !!m.get())
    } else {
      folders = [];
    }
  }

  $: metas = folders.map(f => mailboxMeta(f.get()));
  $: ids = $selection.map(m => m.get().id);

  const to = (to) => {
    moveTo(mailbox.get().id, ids, to.get().id);
    dispatch("moved", {to, messages: $selection})
  }
</script>

{#if folders.length}
  <Menu origin="top right" class="move-to-menu">
    <x-action slot="activator" class="btn-dark" data-tooltip="Mover a">
      <MoveTo/>
      <Ripple />
    </x-action>
    {#each folders as box, i}
      <Menuitem on:click={() => to(box)}>
        <x-item>
          <x-icon>
            <svelte:component this={metas[i].icon}/>
          </x-icon>
          <x-label>
            {metas[i].label}
          </x-label>
        </x-item>
      </Menuitem>
    {/each}
  </Menu>
{/if}