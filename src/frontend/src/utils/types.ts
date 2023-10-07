export interface Node {
    bias?: number;
    x: number;
    y: number;
}

export interface Link {
    source: Node;
    target: Node;
    weight?: number;
}

export interface Graph {
    nodes: Node[];
    links: Link[];
}

export interface Bread {
    id: number,
    type?: 'success' | 'error' | 'warning' | 'info',
    message?: string,
    duration?: number
}