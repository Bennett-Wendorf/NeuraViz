import { writable } from "svelte/store";
import { writableLocalStore } from "./writableLocalStore";
import type { Bread, Graph } from "./types";

let modelValid = writableLocalStore<boolean>('model-valid', false);
modelValid.useLocalStorage();

let graphFile = writableLocalStore<string>('graph-file', null);
graphFile.useLocalStorage();

let graph = writableLocalStore<Graph>('graph', { nodes: [], links: [], activations: [] });
graph.useLocalStorage();

let uploading = writable(false);

let breads = writable<Bread[]>([]);

export { modelValid, graphFile, graph, uploading, breads };