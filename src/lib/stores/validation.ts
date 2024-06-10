import { writable } from "svelte/store";

export const message = writable<string | null>(null);
export const user = writable<string | null>(null);