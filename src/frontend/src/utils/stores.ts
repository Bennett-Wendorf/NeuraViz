import { writable } from "svelte/store";

interface Graph {
    // TODO: Define these types better
    nodes: any[];
    links: any[];
}

let graph = writable({ nodes: [], links: [] });

let uploading = writable(false);

export { graph, uploading };