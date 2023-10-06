import { writable } from "svelte/store";
import type { Bread } from "../components/Toaster/Bread";

interface Graph {
    // TODO: Define these types better
    nodes: any[];
    links: any[];
}

let graph = writable<Graph>({ nodes: [], links: [] });

let uploading = writable(false);

let breads = writable<Bread[]>([]);

export { graph, uploading, breads };