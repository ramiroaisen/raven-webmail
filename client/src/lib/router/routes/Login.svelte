<style>
  form{
    box-sizing: border-box; 
    border-top: 4px solid var(--pc);
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    background: #fff;
    padding: 3em;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .field{
    margin-bottom: 3em;
  }

  .button{
    display: flex;
    flex-direction: row-reverse;
  }

  h1 {
    text-align: center;
    margin: 2em 0;
  }
</style>

<script>
  import {getContext} from "svelte"; 

  //import Page from "/comp/Page.svelte";
  import TextField from "comp@TextField.svelte";
  import Password from "comp@Password.svelte";
  //import Button from "comp@Button.svelte";
  import {Button} from "svelte-mui";

  import {getNotifier} from "comp@Notify/notify.js";

  let username = "";
  let password = "";

  import {login} from "lib@client/client.js"

  const handleSubmit = async event => {
    
    event.preventDefault();
    
    try {
      const user = await fetch("/login", {
        method: "POST", 
        headers: {"content-type": "application/json"},
        body: JSON.stringify({username, password})
      }).then(res => res.json());

      if(user.error) {
        throw new Error(user.error.message);
      }
      location.href = "/";
    } catch (e) {
      getNotifier().add({variant: "error", text: e.message});
    }
  }

  const {locale: l} = getContext("app");
  export let locale = $l.login;

</script>

<svelte:head>
  <title>{locale.title}</title>
</svelte:head>

<h1>{locale.title}</h1>
<form action="#!/login" method="post" on:submit={handleSubmit}>
  <div class="field">
    <TextField bind:value={username} name="username" label={locale.labels.username}/>
  </div>
  <div class="field">
    <Password bind:value={password} name="password" label={locale.labels.password}/>
  </div>
  <div class="button">
    <Button color="var(--pc)" raised>
      {locale.action}
    </Button>
  </div>
</form>