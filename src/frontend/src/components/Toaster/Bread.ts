export interface Bread {
    id: number,
    type?: 'success' | 'error' | 'warning' | 'info',
    message?: string,
    duration?: number
}