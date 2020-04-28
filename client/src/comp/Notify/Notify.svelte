<svelte:options accessors={true}/>

<style>
  .messenger{
    position: fixed;
    z-index: 1210;
    bottom: 0.5em;
    left: 0.5em;
    display: flex;
    flex-direction: column-reverse;
    max-width: 80%;
  }

  .message{
    --icon-size: 1.25em;
    min-width: 250px;
    max-width: 400px;
    display: flex;
    flex-direction: row;
    padding: 0.5em 0.5em 0.5em 1em;
    color: #fff;
    background-color: rgb(50, 50, 50);
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
    margin: 0.5em;
    border-radius: 0.25em;
  }

  .success{
    background-color: #43a047;
  }

  .error{
    background-color: #d32f2f;
  }

  .info{
    background-color: #1976d2;
  }

  .warning{
    background-color: #ffa000;
  }

  .message-icon{
    display: flex;
    flex: none;
    margin: auto 0;
    font-size: 1.5em;
    align-items: center;
    justify-content: center;
    height: 22px;
    width: 22px;
  }

  .message-content{
    padding: .25em 3em .25em 1em;
    line-height: 1.5em;
    margin: auto 0;
  }

  .message-content.text{
    white-space: pre-wrap;
  }

  .message-action{
    margin: auto 0 auto auto;
    flex: none;
  }

</style>

<script>
import {fly} from 'svelte/transition'; 
import {flip} from "svelte/animate";

import Button from 'comp@Button.svelte';

import success from 'svelte-material-icons/CheckCircleOutline.svelte'
import error from 'svelte-material-icons/CloseCircleOutline.svelte'
import info from 'svelte-material-icons/InformationOutline.svelte'
import warning from 'svelte-material-icons/AlertOutline.svelte'

const icons = {success, error, info, warning};

let className = "";
export {className as class};
export let messages = [];
export let maxStack = 3;
export let duration = 3000;
//export let variant = "normal";

// messages[]
// action?: {text: string, fn: (event) => void}
// persist?: false
// html?: html //or
// text?: string
// variant: "success" | "error" | "info" | "warning" | "normal"

export const add = (src) => {
  
  let message;

  if(typeof src === "string"){
    message = {text: stc};
  } else {
    message = {...src};
  }

  message.variant = message.variant || "normal";
  message.duration = message.duration || duration;
  message.persist = !!message.persist;
  message.icon = message.icon || (message.variant === "normal" ? null : icons[message.variant]);

  messages = [...messages, message];

  if(!message.persist){
    setTimeout(() => remove(message), message.duration);
  }

  if(messages.length > maxStack){
    messages = messages.slice(1);
  }
}

export const remove = (key) => {
  messages = messages.filter((message) => message != key);
}

export const clear = () => {
  messages = [];
}

</script>

<div class="messenger {className}">
  {#each messages as message (message)}
    <div 
      transition:fly={{x: -200, duration: 250}}
      animate:flip={{duration: 200}}
      class="message {message.variant}"
    >
    {#if message.icon }
      <div class="message-icon">
        <svelte:component this={message.icon} />
      </div>
    {/if}
    <div class="message-content {message.html != null ? "html" : "text"}">
      {#if message.html != null }
        {@html message.html}
      {:else }
        {message.text}
      {/if}
    </div>

      {#if message.action}
        <div class="message-action">
          <Button on:click={event => message.action.fn(event, message)}>{message.action.text}</Button>
        </div>
      {/if}
    </div>
  {/each}
</div>