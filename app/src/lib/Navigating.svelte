<script lang="ts">
  import { navigating } from  "$app/stores";
  import { browser } from "$app/env";

  let frame: number;

  let el: HTMLElement;  

  let max = 0.9;
  let min = 0.1;

  let last = !!$navigating;

  $: browser && onChange(!!$navigating);
  const onChange = (v: boolean) => {
    if(el == null) return;
    if(last === v) return;
    last = v;
    if(v) {
      let w = min;
      el.style.opacity = "1";
      el.style.width = `${w * 100}%`;
      frame = requestAnimationFrame(function f(){
        const nw = Math.min(w + 0.01, max);
        if(nw === w) return;
        w = nw;
        el && (el.style.width = `${w * 100}%`);
        frame = requestAnimationFrame(f);
      })
    } else {
      if(frame) cancelAnimationFrame(frame);
      el.style.width = "100%"
      el.style.opacity = "0"
    }
  }

</script>

<style>
  .navigating {
    background-color: #fff;
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    height: 2px;
    pointer-events: none;
    transition: opacity 300ms ease 200ms;
  }
</style>

<div class="navigating" bind:this={el} />