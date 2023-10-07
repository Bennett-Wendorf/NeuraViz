import { writable } from "svelte/store";
import type { Bread } from "./types";
import type { Graph } from "./types";

let graph = writable<Graph>({ nodes: [], links: [] });

let uploading = writable(false);

let breads = writable<Bread[]>([]);

export { graph, uploading, breads };