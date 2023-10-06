import { breads } from "./stores";

let nextToastId = 0;

export function sendToast(
    type?: 'success' | 'error' | 'warning' | 'info',
    message?: string,
    duration?: number
) {
    breads.update((currentBreads) => {
        currentBreads.unshift({
            id: nextToastId++,
            type: type,
            message: message,
            duration: duration
        });

        if (currentBreads.length > 5) {
            currentBreads.pop();
        }

        console.log(currentBreads)
        return currentBreads;
    })
}