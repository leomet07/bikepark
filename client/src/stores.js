import { writable } from "svelte/store";

const validauthtoken = writable("");
const markers = writable([]);

export { validauthtoken, markers };
