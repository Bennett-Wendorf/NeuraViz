from dataclasses import dataclass
from models.graph.Node import Node
from models.graph.NodeCollection import NodeCollection
from models.graph.Position import Position
from typing import Self

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

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return Link(source = cls._get_nodelike_object(data["source"]), target = cls._get_nodelike_object(data["target"]), weight = data["weight"], hasDirection = data["hasDirection"], isInput = data["isInput"])

    @classmethod
    def is_link(cls, data: dict) -> bool:
        return "source" in data and "target" in data and "weight" in data and "hasDirection" in data and "isInput" in data

    @classmethod
    def _get_nodelike_object(cls, data: dict) -> Node | NodeCollection | Position:
        if Node.is_node(data):
            return Node.from_dict(data)
        elif NodeCollection.is_node_collection(data):
            return NodeCollection.from_dict(data)
        elif Position.is_position(data):
            return Position.from_dict(data)
        else:
            raise ValueError("Invalid data for node like object")