<script lang="ts" context="module">
  import { getPage, _put } from "$lib/util";
  import type { Load } from "@sveltejs/kit";
  export const load: Load = async ({ page, fetch, session }) => {
    // @ts-ignore
    return await getPage({ page, fetch, session })
  }
</script>

<script lang="ts">
  export let user: User;
  import type { User } from '$lib/types';

  import { signature } from "$lib/signature";

	$: name = user.name || 'Unnamed';
	$: letter = name[0] || '';

  let html = get(signature);

  import { onMount } from "svelte";

  onMount(() => {
    setTimeout(() => {
      html = get(signature);
    }, 1);
  })

  let timer: any = null;
  const onChange = (html: string) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await _put("/api/signature", { html })
        signature.set(html);
      } catch(e: any) {
        getNotifier().error(e?.message)
      }
    }, 300)
  }

  import getNotifier, { _message } from "$lib/Notify/notify";
  import { locale } from "$lib/locale";
	import TransitionPage from '$lib/TransitionPage.svelte';
	import SignatureEditor from '$lib/Editor/SignatureEditor.svelte';
	import { get } from "svelte/store";
</script>

<style>
	.account {
		flex-direction: column;
    --spacing: 1.5rem;
		background: rgba(0, 0, 0, 0.025);
		overflow-x: hidden;
		overflow-y: auto;
		height: 100%;
	}

	.bottom-space {
		height: 7em;
		flex: none;
	}

	.main {
		flex: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: var(--spacing);
		padding-top: calc(var(--spacing) * 2);
	}

	.main > .end {
		font-size: 1.1em;
		display: flex;
		flex-direction: column;
		margin-left: 1.5em;
	}

	.main > .end > div {
		flex: none;
		white-space: nowrap;
		line-height: 1.5em;
	}

	.letter {
		font-size: 3em;
		text-transform: uppercase;
		width: 6rem;
		height: 6rem;
		background: var(--red);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}

  .page {
    padding-inline: var(--spacing);
  }

  .editor {
    background: #fff;
    min-height: 20rem;
    display: flex;
    flex-direction: column;
  }

</style>

<svelte:head>
  <title>{$locale.My_account}</title>
</svelte:head>

<TransitionPage>
  <div class="account">
    <div class="main">
      <div class="letter elev3">{letter}</div>
      <div class="end">
        <div class="name">{name}</div>
        <div class="username">{user.username}</div>
        <div class="address">{user.address}</div>
      </div>
    </div>

    <div class="page">
      <h1>{$locale.Edit_your_signature}</h1>

      <div class="editor elev3">
        <SignatureEditor bind:html {onChange} />
      </div>

    </div>
  </div>
</TransitionPage>