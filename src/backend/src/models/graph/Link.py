from dataclasses import dataclass
from src.models.graph.Node import Node
from src.models.graph.Position import Position

@dataclass
class Link:
    source: Node | Position
    target: Node | Position
    weight: float
    hasDirection: bool = False
    isInput: bool = False