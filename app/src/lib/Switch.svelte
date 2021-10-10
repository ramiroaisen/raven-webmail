<script lang="ts">
  export let checked: boolean = false;
  export let id: string | undefined = void 0;
  export let readonly: boolean = false;
  export let onChange: (v: boolean) => void = () => {};
  export let label: string | undefined | null = null;
  import Ripple from "./Ripple.svelte";

  let lastValue = checked;
  $: onChecked(checked);
  const onChecked = (v: boolean) => {
    if(lastValue === v) return;
    lastValue = v;
    onChange(v);
  }
</script>
<style>

	.switch {
		display: flex;
    align-items: center;
		cursor: pointer;
		user-select: none;
  }
	
  .with-label {
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
  }

  .readonly {
    opacity: 0.6;
  }

	.track {
		position: relative;
		width: 2rem;
		height: 0.8rem;
		background-color: #ddd;
		border-radius: 1rem;
		transition: background-color 125ms ease;
    flex: none;
	}
	
	.on .track {
		background-color: var(--red);
	}
	
	.handle {
		background: #fff;
		box-shadow: rgba(0,0,0,0.5) 0 0 2px 1px;
		width: 1rem;
		height: 1rem;
		position: absolute;
		top: -0.1rem;
		left: 0;
		border-radius: 50%;
		transition: transform 125ms ease;
	}
	
	.on .handle {
		 transform: translateX(1rem);
	}

  .label {
    margin-inline-start: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
</style>

<div class="switch" class:btn-dark={label} class:with-label={label} {id} class:readonly class:on={checked} on:click={() => !readonly && (checked = !checked)}>
	<div class="track">
		<div class="handle">
		</div>
	</div>
  {#if label}
    <div class="label">
      {label}
    </div>
  {/if}
  <Ripple />
</div>