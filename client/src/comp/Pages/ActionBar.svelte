<style>
  x-actionbar {
    flex: none;
    position: relative;
    padding: 0.25em 1em 0 1em;
    height: 2.75em;
    border-bottom: rgba(0,0,0,0.1) 1px solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 10;
    transition: box-shadow 200ms ease;
  }  

  x-actionbar.scrolled {
    box-shadow: rgba(0,0,0,0.3) 0 0.35em 0.15em -0.2em; 
  }

  x-actionbar :global(x-action-group) {
    display: flex;
    flex: none;
    flex-direction: row;
    margin-inline-end: 0.75em;
  }

  x-actionbar :global(x-action-group:empty) {
    display: none;
  }

  x-actionbar :global(x-action),
  x-actionbar :global(.x-action) {
    position: relative;
    flex: none;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    font-size: 1.4em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    transition: color 200ms ease;
    color: #333;
  }

  x-actionbar :global(x-action:hover),
  x-actionbar :global(.x-action:hover){
    color: #111;
  }
 
  /*
  @media screen and (max-width: 768px) {
    x-actionbar > :global(x-action-group:first-child > x-action:first-child:before),
    x-actionbar > :global(x-action-group:first-child > .x-action:first-child:before) {
      left: 0;
      transform: translate(0, -100%);
    }

    x-actionbar:dir(rtl) > :global(x-action-group:first-child > x-action:first-child:before),
    x-actionbar:dir(rtl) > :global(x-action-group:first-child > .x-action:first-child:before) {
      right: 0;
      left: auto;
      transform: translate(0, -100%);
    }
  }
  */
</style>

<script>
  export let scrolled = false;
</script>

<x-actionbar class:scrolled>
  <slot />
</x-actionbar>