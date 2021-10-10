<script lang="ts">
  export let scrolled = false;
</script>

<style>
  .tab-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: box-shadow 300ms ease;
    height: 3rem;
    border-bottom: var(--border) 1px solid;
    flex: none;
    color: #333;
    position: relative;
    z-index: 100;
  }

  .tab-top :global(.action-group) {
    display: flex;
    flex-direction: row;
    padding: 0 0.25rem;
    flex: none;
  }

  .tab-top :global(.action) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 1.35rem;
    border-radius: 50%;
    padding: 0.75rem;
    margin: 0 -0.25rem;
    flex: none;
  }

  .scrolled {
    box-shadow: rgb(0 0 0 / 30%) 0 0.35em 0.15em -0.2em;
  }
</style>

<div class="tab-top" class:scrolled>
  <slot />
</div>