export interface Position {
    x: number;
    y: number;
}

export interface Node {
    bias?: number;
    x: number;
    y: number;
    isInput: boolean;
}

export function isNode(node: Node | NodeCollection | Position): node is Node {
    return (node as Node).bias !== undefined;
}

export interface NodeCollection {
    x: number;
    isInput: boolean;
    numNodes: number;
}

export function isNodeCollection(node: Node | NodeCollection | Position): node is NodeCollection {
    return (node as NodeCollection).numNodes !== undefined;
}

export interface Link {
    source: Node | NodeCollection | Position;
    target: Node | NodeCollection | Position;
    weight?: number;
    hasDirection: boolean;
    isInput: boolean;
}

export interface LinkCollection {
    source: Node | NodeCollection | Position;
    target: Node | NodeCollection | Position;
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