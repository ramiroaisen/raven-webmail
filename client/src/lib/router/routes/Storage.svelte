<script context="module">
  import {get} from "lib@client/client.js";
  export async function preload($page, $session) {
    const res = await get("/users/me/storage");
    return {res};
  }
</script>

<script>
  export let res;
  console.log(res);
</script>

<pre>{JSON.stringify(res, null, 2)}</pre>