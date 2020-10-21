<script>
    export let user;

    import { getContext } from "svelte";
    const { locale: l, trans } = getContext("app");
    export let locale = $l.myAccount;

    console.log(user);

    let clientWidth = 0;
    let letter = user.name[0] || "";

    let narrow, wide;
    $: narrow = clientWidth < 900;
    $: wide = !narrow;

    import CircularGraph from "comp@CircularGraph/CircularGraph.svelte";
    import Arc from "comp@CircularGraph/Arc.svelte";
    import Menu from "comp@Menu/Menu.svelte";
    import MenuItem from "comp@Menu/MenuItem.svelte";
    import LockReset from "svelte-material-icons/LockReset.svelte";
    import Dialog2 from "comp@Dialog/Dialog2.svelte";
    import Password from "root@comp/Password.svelte";
    import Button from "root@comp/Button.svelte";
    import { getNotifier } from "root@comp/Notify/notify.js";
    import { put } from "root@lib/client/client.js";
import ProgressButton from "root@comp/ProgressButton.svelte";

    const GB = (size) => (size / 1024 ** 3).toFixed(2);

    let passwordDialogOpen = false;
    let updatingPassword = false;
    let currentPassword = "";
    let newPassword = "";
    let confirmPassword = "";

    const updatePassword = async () => {
        if (updatingPassword) return;
        updatingPassword = true;
        try {
            if (newPassword.length < 6)
                throw new Error("Password must have 6 characters or more");
            if (newPassword !== confirmPassword)
                throw new Error("Passwords does not match");
            await put("/users/me", {
                existingPassword: currentPassword,
                password: newPassword,
            });
            getNotifier().add({ variant: "normal", text: "Password updated" });
            passwordDialogOpen = false;
        } catch (e) {
            getNotifier().add({ variant: "error", text: e.message });
        } finally {
            updatingPassword = false;
        }
    };
</script>

<style>
    x-account {
        display: flex;
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
        width: 2em;
        height: 2em;
        background: var(--pc);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
    }

    .cols {
        padding: 0 calc(var(--spacing) * 0.5);
        display: flex;
        flex: none;
    }

    .wide .cols {
        flex-direction: column;
    }

    .narrow .cols {
        flex-direction: column;
    }

    .narrow .col {
        width: 100%;
    }

    .wide .col {
        width: 100%;
        //width: 50%;
    }

    .col {
        box-sizing: border-box;
        padding: 0 calc(var(--spacing) * 0.5);
        flex: none;
        display: flex;
        flex-direction: column;
    }

    .box {
        margin: calc(var(--spacing) * 0.5) 0;
        flex: none;
    }

    .box-title {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .box-title > .comment {
        font-size: 0.7em;
        color: #666;
        margin-inline-start: 0.5em;
    }

    .col-2 {
    }

    .quota {
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

    .password-dialog {
        padding: 1.5rem;
    }

    .password-dialog > .field {
        margin-bottom: 1.5rem;
    }

    .send {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
    }
</style>

<x-account bind:clientWidth class:narrow class:wide>
    <div class="main">
        <div class="letter">{letter}</div>
        <div class="end">
            <div class="name">{user.name}</div>
            <div class="username">{user.username}</div>
            <div class="address">{user.address}</div>
        </div>
    </div>
    <div class="cols">
        <div class="col col-1">
            <div class="box common-actions">
                <div class="box-title">{locale.commonActions.title}</div>
                <div class="box-content">
                    <Menu>
                        <MenuItem
                            icon={LockReset}
                            on:click={() => (passwordDialogOpen = true)}>
                            {locale.commonActions.updatePassword}
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <div class="box quota storage-quota">
                <div class="box-title">{locale.limits.storage.title}</div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.quota.used / user.limits.quota.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.quota.used / user.limits.quota.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.gbUsed', {
                                gb: GB(user.limits.quota.used),
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.gbTotal', {
                                gb: GB(user.limits.quota.allowed),
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota imap-download-quota">
                <div class="box-title">
                    {locale.limits.imapDownload.title}
                    <span
                        class="comment">{locale.limits.imapDownload.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.imapDownload.used / user.limits.imapDownload.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.imapDownload.used / user.limits.imapDownload.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.gbUsed', {
                                gb: GB(user.limits.imapDownload.used),
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.gbTotal', {
                                gb: GB(user.limits.imapDownload.allowed),
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota imap-upload-quota">
                <div class="box-title">
                    {locale.limits.imapUpload.title}
                    <span
                        class="comment">{locale.limits.imapUpload.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.imapUpload.used / user.limits.imapUpload.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.imapUpload.used / user.limits.imapUpload.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.gbUsed', {
                                gb: GB(user.limits.imapUpload.used),
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.gbTotal', {
                                gb: GB(user.limits.imapUpload.allowed),
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota pop3-download-quota">
                <div class="box-title">
                    {locale.limits.pop3Download.title}
                    <span
                        class="comment">{locale.limits.pop3Download.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.pop3Download.used / user.limits.pop3Download.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.pop3Download.used / user.limits.pop3Download.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.gbUsed', {
                                gb: GB(user.limits.pop3Download.used),
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.gbTotal', {
                                gb: GB(user.limits.pop3Download.allowed),
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota received-quota">
                <div class="box-title">
                    {locale.limits.received.title}
                    <span
                        class="comment">{locale.limits.received.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.received.used / user.limits.received.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.received.used / user.limits.received.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.messagesUsed', {
                                n: user.limits.received.used,
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.messagesTotal', {
                                n: user.limits.received.allowed,
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota recipients-quota">
                <div class="box-title">
                    {locale.limits.recipients.title}
                    <span
                        class="comment">{locale.limits.recipients.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.recipients.used / user.limits.recipients.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="percent">
                            {Math.round((user.limits.recipients.used / user.limits.recipients.allowed) * 100)}%
                        </div>
                        <div class="used">
                            {$trans('myAccount.limits.messagesUsed', {
                                n: user.limits.recipients.used,
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.messagesTotal', {
                                n: user.limits.recipients.allowed,
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div class="box quota forwards-quota">
                <div class="box-title">
                    {locale.limits.forwards.title}
                    <span
                        class="comment">{locale.limits.forwards.comment}</span>
                </div>
                <div class="quota-body">
                    <CircularGraph>
                        <Arc start={0} end={0.99} stroke="rgba(0,0,0,0.075)" />
                        <Arc
                            start={0}
                            end={user.limits.forwards.used / user.limits.forwards.allowed}
                            stroke="var(--pc)" />
                    </CircularGraph>
                    <div class="quota-desc">
                        <div class="used">
                            {$trans('myAccount.limits.messagesUsed', {
                                n: user.limits.forwards.used,
                            })}
                        </div>
                        <div class="total">
                            {$trans('myAccount.limits.messagesTotal', {
                                n: user.limits.forwards.allowed,
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bottom-space" />
</x-account>

{#if passwordDialogOpen}
    <Dialog2
        bind:open={passwordDialogOpen}
        title={locale.commonActions.updatePassword}>
        <div class="password-dialog">
            <div class="field">
                <Password
                    label={locale.commonActions.currentPassword}
                    bind:value={currentPassword} />
            </div>
            <div class="field">
                <Password
                    label={locale.commonActions.newPassword}
                    bind:value={newPassword} />
            </div>
            <div class="field">
                <Password
                    label={locale.commonActions.confirmPassword}
                    bind:value={confirmPassword} />
            </div>

            <div class="send">
                <ProgressButton color="#4273e8" progress={{size: "1.5em"}} raised inprogress={updatingPassword} on:click={updatePassword}>
                    <span style="text-transform: none; font-size:1.1em">{locale.commonActions.updatePassword}</span>
                </ProgressButton>
            </div>
        </div>
    </Dialog2>
{/if}
