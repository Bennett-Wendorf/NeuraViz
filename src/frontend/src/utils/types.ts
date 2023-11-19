export interface Node {
    bias?: number;
    x: number;
    y: number;
    isInput: boolean;
}

export interface NodeCollection {
    x: number;
    isInput: boolean;
    numNodes: number;
}

export function isNodeCollection(node: Node | NodeCollection): node is NodeCollection {
    return (node as NodeCollection).numNodes !== undefined;
}

export interface Link {
    source: Node;
    target: Node;
    weight?: number;
    hasDirection: boolean;
    isInput: boolean;
}

export interface LinkCollection {
    source: Node;
    target: Node;
    hasDirection: boolean;
    isInput: boolean;
    numLinks: number;
}

export function isLinkCollection(link: Link | LinkCollection): link is LinkCollection {
    return (link as LinkCollection).numLinks !== undefined;
}

export interface Activation {
    function: string;
    category: string;
    xPosition: number;
}

export interface Graph {
    nodes: (Node | NodeCollection)[];
    links:(Link | LinkCollection)[];
    activations: Activation[];
}

export interface Bread {
    id: number,
    type?: 'success' | 'error' | 'warning' | 'info',
    message?: string,
    duration?: number
}

export type activationFunctionIconGetter = (xPosition: number, positionScaleFactor: number, iconDimension: number, lineY2: number) => d3.Selection<Element, undefined, null, undefined>;