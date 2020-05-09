<style>
  .menu {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
  }

  .menu > :global(svg) {
    width: 70%;
    height: 70%;
    color: #666;
  }

  .anchor {
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>

<script>
  import {getContext} from "svelte";

  import {mailboxMeta} from "../../../lib/util";
  export let mailbox;
  export let menuOpen = false;

  const {page} = getContext("router");
  const {locale, trans} = getContext("app");

  let current, meta;
  $: current = $page.params.mailbox === $mailbox.id;
  $: meta = mailboxMeta($mailbox, $locale.mailbox.title);

  import DrawerItem from "../DrawerItem.svelte"

  import {others} from "lib@client/mailboxes.js";
  let menu;
  $: menu = $others.includes(mailbox);

  import DotsVertical from "svelte-material-icons/DotsVertical.svelte";
  import Popup from "comp@Popup.svelte";
  import Menu from "comp@Menu/Menu.svelte";
  import MenuItem from "comp@Menu/MenuItem.svelte";
  import Delete from "svelte-material-icons/TrashCanOutline.svelte"

  import {confirm} from "comp@Dialog/dialog.js";
  import {del} from "lib@client/mailboxes.js";
  import {getNotifier} from "comp@Notify/notify.js";

  const deleteMailbox = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const args = {...$locale.dialogs.deleteMailbox, title: $trans("dialogs.deleteMailbox.title", {mailbox: $mailbox.path})};
    if(await confirm(args)) {
      try {
        await del($mailbox.id);
        getNotifier().add({variant: "success", text: $locale.notifier.mailboxDeleted});
      } catch(e) {
        getNotifier.add({variant: "error", text: e.message});
      }
    }
  }
</script>

<DrawerItem href="#!/mailbox/{$mailbox.id}" {menu} {menuOpen} {current} icon={meta.icon} label={meta.label} counter={$mailbox.unseen}>
  <div slot="menu">
    {#if menu}
      <div class="menu btn-dark" class:hover={menuOpen} class:menu-open={menuOpen} on:click={() => menuOpen = !menuOpen}>
        <DotsVertical />
        <div class="anchor" on:click|stopPropagation>
          <Popup anchor="top-left" bind:open={menuOpen}>
            <Menu>
              <MenuItem icon={Delete} on:click={deleteMailbox}>{$locale.mailbox.delete}</MenuItem>
            </Menu>
          </Popup>
        </div>
      </div>
    {/if}
  </div>
</DrawerItem>
