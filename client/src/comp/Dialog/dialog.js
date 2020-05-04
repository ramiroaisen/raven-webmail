import Alert from "./Alert.svelte";
import Prompt from "./Prompt.svelte";
import Confirm from "./Confirm.svelte";
let alertComponent = null;
let promptComponent = null;
let confirmComponent = null;
export const alert = async (props) => {
    if (alertComponent == null) {
        alertComponent = new Alert({ target: document.body });
    }
    return alertComponent.open(props);
};
export const prompt = async (props) => {
    if (promptComponent == null) {
        promptComponent = new Prompt({ target: document.body });
    }
    return promptComponent.open(props);
};
export const confirm = async (props) => {
    if (confirmComponent == null) {
        confirmComponent = new Confirm({ target: document.body });
    }
    return confirmComponent.open(props);
};
