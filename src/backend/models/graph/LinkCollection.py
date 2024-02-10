from dataclasses import dataclass
from models.graph.Node import Node
from models.graph.Position import Position

@dataclass
class LinkCollection:
    source: Node | Position
    target: Node | Position
    hasDirection: bool = False
    isInput: bool = False
    numLinks: int = 0

    def to_dict(self):
        return {
            "source": self.source.__dict__,
            "target": self.target.__dict__,
            "hasDirection": self.hasDirection,
            "isInput": self.isInput,
            "numLinks": self.numLinks
        }