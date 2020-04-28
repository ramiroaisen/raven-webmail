<script context="module">
  import {writable} from "../../../lib/store";
  import {user} from "../../../lib/client/client";
  import * as mailboxes from "../../../lib/client/mailboxes";
  import * as messages from "../../../lib/client/messages";

  export async function preload($page) {
    
    if ( !user.get() ) {
      return this.redirect("#!/login");
    }

    const mailbox = await mailboxes.get($page.params.mailbox);
    
    if (mailbox == null) {
      return this.redirect("#!/");
    }

    try {
      const $message = await messages.get($page.params.mailbox, $page.params.message);
      const message = writable($message);
      const scroll = writable(0);
      return { mailbox, message, scroll };

    } catch(e) {
      this.redirect(`#!/mailbox/${mailbox.get().id}`);
    }
  }
</script>

<script>
  import Message from "../../../comp/Pages/Message/Message.svelte";
  //import Page from "../../comp/Page.svelte";

  export let mailbox;
  export let message;
  export let scroll;
</script>

<Message {mailbox} {message} {scroll} />