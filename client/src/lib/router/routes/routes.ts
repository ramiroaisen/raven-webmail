/*
import * as Mailbox from "./Mailbox.svelte";
import * as Message from "./Message.svelte"
import * as Error404 from "./404.svelte"
import * as Login from "./Login.svelte"
import * as Index from "./Index.svelte"
import * as Compose from "./Compose.svelte"
*/

/*
export const routes = {
  "/": () => import("./Index.svelte"),
  "/mailbox/:mailbox": () => import("./Mailbox.svelte"),
  "/mailbox/:mailbox/message/:message": () => import("./Message.svelte"),
  "/compose": () => import("./Compose.svelte"),
  "(.*)": () => import("./404.svelte"),  
}
*/

export const routes = {
  "/": () => import("./Index.svelte"),
  "/login": () => import("./Login.svelte"),
  "/mailbox/:mailbox": () => import("./Mailbox.svelte"),
  "/mailbox/:mailbox/message/:message": () => import("./Message.svelte"),
  "/storage": () => import("./Storage.svelte"),
  "(.*)": () => import("./404.svelte")
}