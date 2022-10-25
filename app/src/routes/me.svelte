<script lang="ts" context="module">
  import { getPage } from "$lib/util";
  import type { Load } from "@sveltejs/kit";
  export const load: Load = async ({ page, fetch, session }) => {
    // @ts-ignore
    return await getPage({ page, fetch, session })
  }
</script>

<script lang="ts">
  export let user: User;
  import type { User } from '$lib/types';

	$: name = user.name || 'Unnamed';
	$: letter = name[0] || '';

	import LockReset from 'svelte-material-icons/LockReset.svelte';
	import DrawPen from 'svelte-material-icons/Draw.svelte';
	import CircularGraph from '$lib/CircularGraph.svelte';
	import MenuItem from '$lib/Menu/MenuItem.svelte';
	import Password from '$lib/Password.svelte';
	import Dialog from '$lib/Dialog.svelte';
  import Ripple from '$lib/Ripple.svelte';
  import { action, _put } from '$lib/util';

  import AccountEdit from "svelte-material-icons/AccountEditOutline.svelte";
  import TextField from "$lib/TextField.svelte";
  import { _message } from "$lib/Notify/notify";
  import { locale } from "$lib/locale";
	import TransitionPage from '$lib/TransitionPage.svelte';

	const gb = (size: number) => (size / 1024 ** 3).toFixed(2);

  let passwordDialogOpen = false;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';

	const updatePassword = action(async () => {
		if (newPassword.length < 6) throw new Error('Password must have 6 characters or more');
		if (newPassword !== confirmPassword) throw new Error('Passwords does not match');
			
    await _put(`/api/me`, {
      existingPassword: currentPassword,
      password: newPassword,
    });
    
    currentPassword = '';
		newPassword = '';
		confirmPassword = '';

    passwordDialogOpen = false;

    _message($locale.notifier.Password_updated);
  })

  let nameOpen = false;
  let newName = user.name || "";
  const editName = action(async () => {
    if(!newName?.trim()) return;
    await _put("/api/me", { name: newName });
    user.name = newName
    nameOpen = false;
    _message($locale.notifier.Name_updated);
  })
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

	.box {
		margin: 2rem 1rem;
    background: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
	}

	.box-title {
		display: flex;
		flex-direction: row;
		align-items: center;
    font-size: 1.25em;
    flex: none;
    border-bottom: var(--border) 1px solid;
    padding: 1rem;
	}

	.box-title > .comment {
		font-size: 0.8em;
		color: #666;
		margin-inline-start: 0.5em;
	}

	.quota-body {
		display: flex;
		flex-direction: row;
		flex: none;
	}

	.quota-body > :global(svg) {
		width: 10em;
		height: 10em;
	}

	.quota-desc {
		flex: none;
		align-self: center;
	}

	.quota-desc > .percent {
		font-size: 1.5em;
		font-weight: 500;
		color: var(--pc);
		margin-bottom: 0.1em;
	}

	.quota-desc > .used {
		font-size: 1.15em;
		color: #333;
	}

	.quota-desc > .total {
		font-size: 1.15em;
		color: #666;
	}

	.password-dialog > .field {
		margin-bottom: 1.5rem;
	}

	.send {
		margin-top: 1rem;
		display: flex;
		justify-content: flex-end;
	}

  .menu {
    padding: 0.5rem 0;
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
  
    <div class="box elev3 common-actions">
      <div class="box-title">{$locale.Common_actions}</div>
      <div class="menu box-content">
        <MenuItem icon={AccountEdit} on:click={() => nameOpen = true}>
          {$locale.Edit_your_name}
        </MenuItem>
        <MenuItem icon={DrawPen} href="/signature">
          {$locale.Edit_your_signature}
        </MenuItem>
        <MenuItem icon={LockReset} on:click={() => passwordDialogOpen = true}>
          {$locale.Update_your_password}
        </MenuItem>
      </div>
    </div>

    <div class="box elev3 quota storage-quota">
      <div class="box-title">{$locale.Storage}</div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.quota.used / user.limits.quota.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round((user.limits.quota.used / user.limits.quota.allowed) * 100)}%
          </div>
          <div class="used">
            {gb(user.limits.quota.used)} GB
          </div>
          <div class="total">
            {$locale.of} {gb(user.limits.quota.allowed)} GB
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota imap-download-quota">
      <div class="box-title">
        {$locale.IMAP_Download}
        <span class="comment">{$locale.daily}</span>
      </div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.imapDownload.used / user.limits.imapDownload.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round(
              (user.limits.imapDownload.used / user.limits.imapDownload.allowed) * 100
            )}%
          </div>
          <div class="used">
            {gb(user.limits.imapDownload.used)} GB
          </div>
          <div class="total">
            {$locale.of} {gb(user.limits.imapDownload.allowed)} GB
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota imap-upload-quota">
      <div class="box-title">
        {$locale.IMAP_Upload}
        <span class="comment">{$locale.daily}</span>
      </div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.imapUpload.used / user.limits.imapUpload.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round((user.limits.imapUpload.used / user.limits.imapUpload.allowed) * 100)}%
          </div>
          <div class="used">
            {gb(user.limits.imapUpload.used)} GB
          </div>
          <div class="total">
            {$locale.of} {gb(user.limits.imapUpload.allowed)} GB
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota pop3-download-quota">
      <div class="box-title">
        {$locale.POP3_Download}
        <span class="comment">{$locale.daily}</span>
      </div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.pop3Download.used / user.limits.pop3Download.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round(
              (user.limits.pop3Download.used / user.limits.pop3Download.allowed) * 100
            )}%
          </div>
          <div class="used">
            {gb(user.limits.pop3Download.used)} GB
          </div>
          <div class="total">
            {$locale.of} {gb(user.limits.pop3Download.allowed)} GB
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota received-quota">
      <div class="box-title">
        {$locale.Received}
        <span class="comment">{$locale.by_minute}</span>
      </div>
      <div class="quota-body">
        <CircularGraph start={0} end={user.limits.received.used / user.limits.received.allowed} />
        <div class="quota-desc">
          <div class="percent">
            {Math.round((user.limits.received.used / user.limits.received.allowed) * 100)}%
          </div>
          <div class="used">
            {user.limits.received.used} {user.limits.received.used === 1 ? "message" : "messages"}
          </div>
          <div class="total">
            {$locale.of} {user.limits.received.allowed} {user.limits.received.allowed === 1 ? "message" : "messages"}
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota recipients-quota">
      <div class="box-title">
        {$locale.Sent}
        <span class="comment">{$locale.daily}</span>
      </div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.recipients.used / user.limits.recipients.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round((user.limits.recipients.used / user.limits.recipients.allowed) * 100)}%
          </div>
          <div class="used">
            {user.limits.recipients.used} {user.limits.recipients.used === 1 ? $locale.message : $locale.messages}
          </div>
          <div class="total">
            {$locale.of} {user.limits.recipients.allowed} {user.limits.recipients.allowed === 1 ? $locale.message : $locale.messages}
          </div>
        </div>
      </div>
    </div>

    <div class="box elev3 quota forwards-quota">
      <div class="box-title">
        {$locale.Forwarded}
        <span class="comment">{$locale.daily}</span>
      </div>
      <div class="quota-body">
        <CircularGraph
          start={0}
          end={user.limits.forwards.used / user.limits.forwards.allowed}
        />
        <div class="quota-desc">
          <div class="percent">
            {Math.round((user.limits.forwards.used / user.limits.forwards.allowed) * 100)}%
          </div>
          <div class="used">
            {user.limits.forwards.used} {user.limits.forwards.used === 1 ? $locale.messages : $locale.messages}
          </div>
          <div class="total">
            {$locale.of} {user.limits.forwards.allowed} {user.limits.forwards.allowed === 1 ? $locale.message : $locale.messages}
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-space" />
  </div>
  </TransitionPage>

{#if passwordDialogOpen}
	<Dialog onClose={() => passwordDialogOpen = false} width="500px" title={$locale.Update_your_password}>
		<form class="password-dialog" on:submit|preventDefault={updatePassword}>
			<div class="field">
				<Password label={$locale.Current_password} bind:value={currentPassword} />
			</div>
			<div class="field">
				<Password label={$locale.New_password} bind:value={newPassword} />
			</div>
			<div class="field">
				<Password label={$locale.Confirm_password} bind:value={confirmPassword} />
			</div>

			<div class="send">
				<button class="btn-light btn-primary elev2">
          {$locale.Send}
          <Ripple />
        </button>
			</div>
		</form>
	</Dialog>
{/if}

{#if nameOpen}
  <Dialog title={$locale.Edit_your_name} onClose={() => nameOpen = false} width="500px">
    <form class="password-dialog" on:submit|preventDefault={editName}>
			<div class="field">
				<TextField label={$locale.New_name} bind:value={newName} />
			</div>
			<div class="send">
				<button class="btn-light btn-primary elev2">
          {$locale.Send}
          <Ripple />
        </button>
			</div>
		</form>
  </Dialog>
{/if}