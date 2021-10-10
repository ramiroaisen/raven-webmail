<style>
  x-upload {
    display: flex;
    position: relative;
  }
  
  x-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 3em;
    border-radius: 50%;
    color: #444;
  }

  x-action:hover {
    color: #111;
  }

  x-action > :global(svg) {
    font-size: 1.5em;
  }

  input {
    display: none;
  }

  x-bubble {
    position: absolute;
    background: var(--red);
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    font-size: 0.7em;
    color: #fff;
    box-shadow: rgba(0,0,0,0.4) 0 0 3px 0;
    top: 0;
    right: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  x-popup {
    filter: drop-shadow(rgba(0,0,0,0.4) 0 0 3px);
    transform: translate(-2rem, 0.4em);
  }

  x-popup-body {
    position: absolute;
    top: -0.75em;
    right: -6em;
    width: 20rem;
    max-height: 70vh;
    background: #fff;
    border-radius: 3px;
    display: flex;
    max-width: 80vw;
    transform: translate(0, -100%);
    flex-direction: column;
  }

  x-popup-top {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 0.5em;
    flex: none;
  }
  
  x-label {
    flex: 1;
    margin: 0.5em;
  }

  x-scroll {
    padding: 0 0.5em;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .arrow {
    position: absolute;
    left: 0;
    top: 0;
    width: 1.25em;
    height: 0.75em;
    margin-top: -0.8em;
    margin-left: -0.2em;
  }

  x-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .add {
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    color: #444;
  }
</style>

<script lang="ts">
  export let draft: Draft;
  export let open = false;
  export let loading: number = 0;

  let input: HTMLInputElement;

  import { Draft, fileError, fileFile, fileLoaded, fileState, MessageFile } from "$lib/Compose/compose";

  import { fly, scale } from "svelte/transition";
  import FileItem from "./FileItem.svelte";
  import Clip from "svelte-material-icons/Paperclip.svelte"
  import Ripple from "$lib/Ripple.svelte";
  import CircularProgress from "$lib/CircularProgress.svelte";
  import { tooltip } from "$lib/actions";
import { locale } from "$lib/locale";
  
  const remove = (file: MessageFile) => {
    draft.files = draft.files.filter(item => item !== file);
  }

  const add = async (file: File) => {
    loading++;
    try {
      let item: MessageFile = {
        id: void 0,
        size: file.size,
        contentType: file.type,
        filename: file.name,
        [fileState]: "uploading",
        [fileFile]: file,
        [fileLoaded]: 0,
      }
      
      draft.files = [...draft.files, item];

      const { id } = await upload(file, event => {
        item[fileLoaded] = event.loaded;
        draft.files = [...draft.files];
      })

      if(id == null) {
        throw new Error("No 'id' in response");
      }

      item.id = id;
      item[fileState] = "complete";
      draft.files = [...draft.files];
      loading--;
    } catch(e: any) {
      file[fileState] = "error";
      file[fileError] = String(e?.message);
      delete file[fileFile];
      draft.files = [...draft.files];
      loading--;
    }
  }

  const upload = async (file: File, onProgress: (event: ProgressEvent) => void) => {
    const axios = (await import("axios")).default;
    const json = await axios.post(`/api/storage?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`, file, {
      headers: { "content-type": "application/binary" },
      onUploadProgress: onProgress,
    }).then(res => {
      const json = res.data;
      if(json?.error) {
        throw new Error(json.error.message);
      }
      return json;
    }).catch((e: any) => {
      if(e.response) {
        const res = e.response;
        if(res.headers["content-type"] === "application/json") {
          const json = res.data;
          if(json.error) {
            throw new Error(json.error.message);
          } else {
            throw e;
          }
        } else if (res.status === 413) {
          throw new Error(`File ${file.name} is too big`);
        } else {
          throw e;
        }
      }
    })
  
    return json;
  }

  const change = () => {
    for(const file of [].slice.call(input.files)) {
      if(!draft.files.find(item => item[fileFile] === file)) {
        open = true;
        add(file);
      }
    }
  }

  const click = () => {
   if (draft.files.length === 0 && !open) {
      input?.click();
   } else {
      open = !open;
    }
  }
</script>

<x-upload>
  
  <input bind:this={input} on:change={change} type="file" name="0-upload" id="0-upload" multiple>
  
  <x-action class="upload btn-dark" class:hover={open} use:tooltip={open ? null : $locale.Attach} on:click={click}>
    <Clip/>
    {#if loading > 0}
      <x-loading>
        <CircularProgress size="100%" />
      </x-loading>
    {/if}
    {#if draft.files.length}
      <x-bubble transition:scale|local={{duration: 200}}>
        {draft.files.length}
      </x-bubble>
    {/if}
    <Ripple />
  </x-action>

  {#if open}
    <x-popup transition:fly|local={{x: 0, y: 20, duration: 250}}>
      <svg class="arrow" viewBox="0 0 24 24" preserveAspectRatio="none">
        <path d="M0 0 L24 0 L12 24 L 0 0" fill="#fff"/>
      </svg>
      <x-popup-body>
        <x-scroll>
          {#each draft.files as file (file)}
            <FileItem {file} onRemove={() => remove(file)} />
          {/each}
        </x-scroll>
        <x-popup-top>
          <x-label></x-label>
          <button class="add btn-dark" on:click={() => input?.click()}>
            {$locale.Add}
            <Ripple />
          </button>
        </x-popup-top>
      </x-popup-body>
    </x-popup>
  {/if}
</x-upload>
  

