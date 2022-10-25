import { browser } from "$app/env";
import { writable } from "svelte/store";

import { RAVEN_SIGNATURE_META_KEY } from "../../../server/src/metadata";

export { RAVEN_SIGNATURE_META_KEY };

const signature = writable("");

if(!browser) {
  signature.set = () => console.warn("[Signature]: trying to set to signature store on server side, ignoring");
  signature.update = () => console.warn("[Signature]: trying to update to signature store on server side, ignoring");
}

export { signature };