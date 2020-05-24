<style>
    .progress {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000000;
        width: calc(var(--progress) * 100%);
        will-change: width;
        height: var(--preloading-height, 3px);
        background-color: var(--preloading-color, #f5bc05);
        transition: width 200ms ease, opacity 450ms ease 600ms;
        pointer-events: none;
        opacity: 0;
    }

    .show {
        opacity: 1;
        transition: width 100ms ease, opacity 250ms;
    }
</style>

<script>
    export let preloading;

    let progress = 0;

    let timer;
    let incrementInterval = 350;
    let stepMin = 0.05;
    let stepMax = 0.15;
    let max = 0.9;
    let min = 0.15;

    const rand = () => {
        return stepMin + Math.random() * stepMax - stepMin;
    }

    let show = preloading;
    const enter = () => {
        clearTimeout(timer);
        progress = min;
        show = true;
        timer = setInterval(() => {
            progress = Math.min(max, progress + rand());
        }, incrementInterval);
    }

    const leave = () => {
        clearInterval(timer);
        progress = 1;
        show = false;
        timer = setTimeout(() => progress = 0, 1050)
    }

    $: $preloading ? enter() : leave();

    // prevent first show
    let mounted = false;
    import {onMount} from "svelte";
    onMount(() => {
        setTimeout(() => {
            mounted = true;
        }, 1000)
    })

</script>

<div class="progress" class:show={mounted && show} style="--progress: {progress};"></div>