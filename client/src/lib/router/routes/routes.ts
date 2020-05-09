export const routes = {
  "/": () => import("./Index.svelte"),
  "/login": () => import("./Login.svelte"),
  "/mailbox/:mailbox": () => import("./Mailbox.svelte"),
  "/mailbox/:mailbox/message/:message": () => import("./Message.svelte"),
  "/storage": () => import("./Storage.svelte"),
  "/account": () => import("./Account.svelte"),
  "/filters": () => import("./Filters.svelte"),
  "(.*)": () => import("./404.svelte")
}