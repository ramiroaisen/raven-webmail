<script>
    import DrawerItem from "./DrawerItem.svelte";
    import Add from "svelte-material-icons/FolderPlusOutline.svelte";
    import {getNotifier} from "comp@Notify/notify.js";
    import {createMailbox} from "lib@client/mailboxes.js";
    import {getContext} from "svelte";

    const {locale: l, trans} = getContext("app");
    export let locale = $l;

    import {prompt} from "comp@Dialog/dialog.js";
    const createFolder = async () => {
        let path = await prompt(locale.dialogs.createMailbox);
        if(path && (path = path.trim())) {
            try {
                await createMailbox(path);
                getNotifier().add({variant: "success", text: $trans("drawerActions.createMailbox.success", {n: path})});
            } catch(e) {
                getNotifier().add({variant: "error", text: e.message});
            }
        }
    }
</script>

<style>
    x-drawer-actions {
        display: flex;
        flex-direction: column;
    }
</style>

<x-drawer-actions>
    <DrawerItem label={locale.drawerActions.createMailbox.label} icon={Add} on:click={createFolder}/>
</x-drawer-actions>


