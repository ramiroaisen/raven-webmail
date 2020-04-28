import App from './App.svelte';
import { getApp } from "./lib/app";
async function main() {
    const app = await getApp();
    document.body.innerHTML = "";
    new App({
        target: document.body,
        props: { app },
        intro: true,
    });
}
main();
