<script context="module">
  import {user} from  "../../client/client";
  import {get} from "../../client/mailboxes";
  import {list} from "../../client/messages";
  import {createSelection} from "../../selection";

  export async function preload($page, {client}){
    
    if ( !user.get() ) {
      return this.redirect("#!/login");
    }

    const mailbox = get($page.params.mailbox);
    if (mailbox == null ) {
      return this.error({code: 404, message: "La página no existe"})
    } else {
      const json = await list($page.params.mailbox)
      
      const messages = writable(json.messages.map(m => writable(m)));
      const next = writable(json.next);
      const prev = writable(json.prev);
      const selection = createSelection();
      const scroll = writable(0);

      return {mailbox, messages, prev, next, selection, scroll};
    }
  }
</script>

<script>
  import {writable} from "../../store";
  import Mailbox from "../../../comp/Pages/Mailbox/Mailbox.svelte";
  
  // stores;
  export let mailbox 
  export let messages;
  export let prev;
  export let next;
  export let selection;
  export let scroll;
</script>

<Mailbox {mailbox} {messages} {prev} {next} {selection} {scroll} />