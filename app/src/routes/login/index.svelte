<script lang="ts">
  import { goto } from "$app/navigation";
  import Formy from "$lib/Formy/Formy.svelte";
import { locale } from "$lib/locale";
  import Password from "$lib/Password.svelte";
  import TextField from "$lib/TextField.svelte";
  import { action, _post } from "$lib/util";

  let username: string = "";
  let password: string = "";

  const login = action(async () => {
    await _post("/api/login", {username, password});
    goto("/");
  })
</script>

<style>
  h1 {
    font-weight: 600;
    font-size: 1.75rem;
    text-align: center;
    margin: 4rem 0 2rem 0;
  }

  .box {
    width: 400px;
    box-sizing: border-box;
    max-width: 90%;
    margin: 0 auto 3rem auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }

  .password {
    margin-top: 1.5rem;
  }

  .submit {
    margin: 1.5rem 0.5rem 0 auto;
  }
</style>

<svelte:head>
  <title>{$locale.Sign_in}</title>
</svelte:head>

<div class="page">
  
  <h1>{$locale.Sign_in}</h1>
  
  <Formy action={login} let:submit>
    
    <form class="box elev3" on:submit|preventDefault={submit}>
      
      <div class="username">
        <TextField validate required label={$locale.Username} bind:value={username} /> 
      </div>
      
      <div class="password">
        <Password label={$locale.Password} bind:value={password} />
      </div>

      <button type="submit" class="elev2 submit btn-light btn-primary">
        {$locale.Sign_in}
      </button>
    </form>
  </Formy>
</div>