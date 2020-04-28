<style>
  .addr-input {
    flex: 1;
    display: flex; 
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  x-addr {
    font-size: 0.8em;
    white-space: nowrap;
    flex: none;
    height: 2em;
    line-height: 2em;
    padding-inline-start: 0.75em;
    margin-inline-start: 0.5em;
    margin-top: 0.5em;
    margin-bottom: 0.25em;
    border-radius: 1em;
    background: #eee;

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  x-addr:first-child{
    margin-inline-start: 0.75em;
  }

  x-addr-close {
    width: 1.5em;
    height: 1.5em;
    margin: 0.25em 0.25em 0.25em 0;
    cursor: pointer;
    border-radius: 50%;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

  }

  input {
    flex: 1;
    padding: 0.5em;
    margin: 0;
    outline: 0;
    border: 0;
    font-size: inherit;
    font-family: inherit;
    min-width: 12em;
  }

</style>

<script>
  import Close from "svelte-material-icons/Close.svelte";

  export let name = "";
  export let id = ""
  export let addrs = []; // {name, address}[]

  export let value = "";
  export let input = null;

  const add = () => {
    const address = value.trim();
    if( address ) {
      if (!addrs.some(a => a.address === address)) {
        addrs = [...addrs, {address, name: ""}];
        value = "";
      }
    }
  }

  const keypress = (event) => {
    if(event.key === "Enter") {
      add();
    }
  }


  const keydown = (event) => {
    if ( event.key === "Backspace" ) {
      if ( addrs.length ) {
        if ( input.selectionStart === input.selectionEnd && input.selectionStart === 0 ) {
          addrs = addrs.slice(0, addrs.length - 1);
        }
      }
    }
  }

  const blur = add;
   
  const remove = i => {
    const helper = addrs.slice();
    helper.splice(i, 1);
    addrs = helper;
  }

  
</script>

<label class="addr-input">
  {#each addrs as addr, i}
    <x-addr>
      {addr.address}
      <x-addr-close on:click={() => remove(i)} >
        <Close />
      </x-addr-close>
    </x-addr>
  {/each}
  <input type="text" autocomplete="off" bind:this={input} name={name} id={id} on:keypress={keypress} on:blur={blur} on:keydown={keydown} bind:value on:input />
</label>
