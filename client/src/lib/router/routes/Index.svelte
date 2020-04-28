<script context="module">
  import {user} from "../../client/client";
  import {inbox} from "../../client/mailboxes";

  export async function preload($page, $session) {
    if (user.get()) {
      this.redirect(`#!/mailbox/${inbox.get().id}`);
    } else {
      this.redirect("#!/login");
    }
  }
</script>