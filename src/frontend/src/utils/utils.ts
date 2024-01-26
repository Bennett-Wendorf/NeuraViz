import { breads } from "./stores";

let nextToastId: number = 0;

export function sendToast(
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    message: string = 'Something happened!',
    duration?: number
) {
    if (!duration) {
        duration = type === 'error' ? Infinity : 8;
    }

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

        return currentBreads;
    })
}

export function getResponseError(err: any): readonly [field: string, message: string] {
    let field = err.response?.data?.field ?? 'general';
    let message = err.response?.data?.message ?? err.message ?? err;
    return [field, message] as const;
}

export function getScaledAbsoluteTanH(maxAbs: number) {
    if (maxAbs === 0) {
        return (value: number) => 0;
    }
    return (value: number) => absoluteTanH(value * (2/maxAbs)); // The two here comes from the location that tanh gets pretty close to 1 (visually)
}

export function absoluteTanH(value: number) {
    return Math.abs(Math.tanh(value));
}