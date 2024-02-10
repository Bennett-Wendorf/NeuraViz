from dataclasses import dataclass
from models.graph.Node import Node
from models.graph.NodeCollection import NodeCollection
from models.graph.Position import Position

@dataclass
class Link:
    source: Node | NodeCollection | Position
    target: Node | NodeCollection | Position
    weight: float
    hasDirection: bool = False
    isInput: bool = False

    def to_dict(self):
        return {
            "source": self.source.__dict__,
            "target": self.target.__dict__,
            "weight": self.weight,
            "hasDirection": self.hasDirection,
            "isInput": self.isInput
        }