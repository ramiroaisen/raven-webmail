<script lang="ts" context="module">
  export type Context = {
    register: (fn: () => boolean) => () => void
    submit: () => void
    registerMessage: (element: HTMLElement) => () => void 
    validate: () => boolean
  };
</script>

<script lang="ts">
  export let action: () => void;

  import { setContext } from "svelte";

  const validators: (() => boolean)[] = [];

  const messages: HTMLElement[] = [];

  const register = (fn: () => boolean) => {
    validators.push(fn);
    return () => {
      const i = validators.indexOf(fn);
      if(i !== -1) validators.splice(i, 1);
    }
  }

  const registerMessage = (element: HTMLElement) => {
    messages.push(element);
    return () => {
      const i = messages.indexOf(element);
      if(i !== -1) messages.splice(i, 1);
    }
  }

  const submit = () => {
    if(validate()) action();
  }

  const validate = (): boolean => {
    const valids = validators.map(item => item());
    const isValid = valids.every(b => b);

    if(!isValid) {
      setTimeout(() => {
        const collection: HTMLElement[] = [].slice.call(document.getElementsByClassName("validation-error"));
        const element = messages.filter(element => collection.includes(element)).sort((a, b) => collection.indexOf(a) - collection.indexOf(b))[0];
        if(element && element.scrollIntoView) element.scrollIntoView({behavior: "smooth"});
      }, 25)
    }

    return isValid;
  }

  const context: Context = {register, registerMessage, validate, submit};
  setContext("formy", context);
</script>

<slot {submit} {validate} />
