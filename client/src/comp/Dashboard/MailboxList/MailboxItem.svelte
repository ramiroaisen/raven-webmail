<script>
  import {getContext} from "svelte";

  import {mailboxMeta} from "../../../lib/util";
  export let mailbox;

  const {page} = getContext("router");
  const {locale} = getContext("app");

  let current, meta;
  $: current = $page.params.mailbox === $mailbox.id;
  $: meta = mailboxMeta($mailbox, $locale.mailbox.title);

  import DrawerItem from "../DrawerItem.svelte"
</script>

<DrawerItem href="#!/mailbox/{$mailbox.id}" {current} icon={meta.icon} label={meta.label} counter={$mailbox.unseen} />
