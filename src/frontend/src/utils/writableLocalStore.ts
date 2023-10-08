import { writable } from "svelte/store";

export function writableLocalStore<T>(key: string, startValue: T) {
    const { subscribe, set, update } = writable(startValue);

    return {
        subscribe,
        set,
        update,
        useLocalStorage: () => {
            const json = localStorage.getItem(key);
            if (json) {
                set(JSON.parse(json));
            }

            subscribe(current => {
                let json = JSON.stringify(current);
                localStorage.setItem(key, json);
            });
        }
    }
}