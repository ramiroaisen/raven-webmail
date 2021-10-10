<script>

import { locale } from "$lib/locale";

</script>
<style>
  .top {
    height: var(--top-h);
    background: var(--red);/*  */
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .logo {
    font-weight: 500;
    font-size: 1.25rem;
    margin: 0 1.5rem;
  }
</style>

<div class="dash">
  <div class="top">
    <div class="logo">{$locale.Raven}</div>
  </div>

  <div class="page">
    <slot />
  </div>
</div>