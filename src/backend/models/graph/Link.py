from dataclasses import dataclass
from models.graph.Node import Node
from models.graph.Position import Position

@dataclass
class Link:
    source: Node | Position
    target: Node | Position
    weight: float
    hasDirection: bool = False
    isInput: bool = False