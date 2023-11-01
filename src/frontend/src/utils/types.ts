export interface Node {
    bias?: number;
    x: number;
    y: number;
    isInput: boolean;
}

export interface Link {
    source: Node;
    target: Node;
    weight?: number;
    hasDirection: boolean;
    isInput: boolean;
}

export interface Activation {
    function: string;
    type: string;
    x: number;
}

export interface Graph {
    nodes: Node[];
    links: Link[];
    activations: Activation[];
}

export interface Bread {
    id: number,
    type?: 'success' | 'error' | 'warning' | 'info',
    message?: string,
    duration?: number
}

export type activationFunctionIconGetter = (xPosition: number, positionScaleFactor: number, iconDimension: number, lineY2: number) => d3.Selection<Element, undefined, null, undefined>;