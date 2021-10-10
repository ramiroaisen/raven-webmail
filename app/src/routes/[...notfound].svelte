<script lang="ts">
  import Ripple from "$lib/Ripple.svelte";
  import type { Load } from "@sveltejs/kit";
  
  export const load: Load = () => {
    return {
      status: 404,
    }
  }
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
  <h1>404 Not found</h1>
  <p>Oops! this page doesn't exists anymore</p>
  <a href="/" class="na btn-primary elev2">
    Take me to my inbox
    <Ripple />
  </a>
</div>