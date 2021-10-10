<script lang="ts" context="module">
  import type { ErrorLoad } from "@sveltejs/kit";
  export const load: ErrorLoad = ({ error, status }) => {
    return {
      props: {
        error,
        status,
      }
    }
  }
</script>

<script lang="ts">
  export let status: number;
  export let error: Error;
  import Ripple from "$lib/Ripple.svelte";
  import { locale } from "$lib/locale";
</script>

<style>
  .page {
    padding: 2rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }
</style>

<div class="page">
  <h1>{status} {error?.message || error}</h1>
  <p>{$locale.Error_message}</p>
  <a href="/" class="na btn-light btn-primary elev2">
    {$locale.Take_me_to_my_inbox}
    <Ripple />
  </a>
</div>