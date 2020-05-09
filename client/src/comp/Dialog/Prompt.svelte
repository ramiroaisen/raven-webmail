
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

<script>
    import Dialog from "./Dialog.svelte";
    import {writable} from "lib@store.js";

    // @args
    // title: string
    // label: string
    // accept: string
    // cancel: string
    // value: string = "";
    let args = {};

    let accept;
    let cancel;

    const keydown =  event => {
        if (accept && event.key === "Enter")
            accept();
    };

    let value = "";

    let dialog;

    export const open = async (_args) => {

        args = _args

        if(value != null) {
            value = _args.value;
        }

        return new Promise(resolve => {

            const close = dialog.open({
                title: args.title,
                modal: false,
                onClose: () => resolve(false)
            });

            accept = () => {
                close();
                resolve(value);
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

<Dialog bind:this={dialog} title={args.title}>
    <div class="body">
        <TextField label={args.label} bind:value={value} on:keydown={keydown}/>
    </div>
    <div class="actions">
        <Button class="accept" on:click={accept} raised color="var(--pc)">{args.accept}</Button>
        <Button class="cancel" on:click={cancel}>{args.cancel}</Button>
    </div>
</Dialog>