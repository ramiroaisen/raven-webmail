import Alert from "./Alert.svelte";
import Prompt from "./Prompt.svelte";
import Confirm from "./Confirm.svelte";

let alertComponent: InstanceType<typeof Alert> | null = null;
let promptComponent: InstanceType<typeof Prompt> | null = null;
let confirmComponent: InstanceType<typeof Confirm> | null = null;

export const alert = async (props: {title: string, message?: string}): Promise<void> => {
    if (alertComponent == null) {
        alertComponent = new Alert({target: document.body});
    }

    return alertComponent.open(props);
}

export const prompt = async (props: {title: string, label: string, type: string}): Promise<string> => {
    if (promptComponent == null) {
        promptComponent = new Prompt({target: document.body});
    }
    return promptComponent.open(props);
}

export const confirm = async (props: {title: string, label: string, acceptMessage: string, cancelMessage: string}) => {
    if(confirmComponent == null) {
        confirmComponent = new Confirm({target: document.body});
    }

    return confirmComponent.open(props);
}