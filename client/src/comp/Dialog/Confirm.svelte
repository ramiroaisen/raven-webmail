<script>
    import Dialog from "./Dialog.svelte";

    // @args
    // title: string
    // desc: string
    // accept: string
    // cancel: string
    let args = {};

    let accept;
    let cancel;

    let dialog;

    export const open = async (_args) => {

        return new Promise(resolve => {

            const close = dialog.open({
                title: _args.title,
                modal: false,
                onClose: () => {
                    console.log("onClose");
                    resolve(false);
                }
            });

            args = _args;

            accept = () => {
                close();
                resolve(true);
            }

            cancel = () => {
                close();
                resolve(false)
            }
        })
    }

    import {Button} from "svelte-mui";
    import TextField from "comp@TextField.svelte";
</script>

<style>
    .body {
        padding: 1.5em;
    }

    .actions {
        display: flex;
        flex-direction: row-reverse;
        padding: 1.5em;
        padding-top: 0;
    }

    .actions > :global(.cancel) {
        margin-inline-end: 1.5em;
    }
</style>

<Dialog bind:this={dialog} title={args.title}>
    <div class="body">
        {args.desc}
    </div>
    <div class="actions">
        <Button class="accept" on:click={accept} raised color="var(--pc)">{args.accept}</Button>
        <Button class="cancel" on:click={cancel}>{args.cancel}</Button>
    </div>
</Dialog>