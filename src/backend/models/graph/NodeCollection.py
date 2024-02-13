from dataclasses import dataclass
from typing import Optional, Self

@dataclass
class NodeCollection:
    id: str
    x: float = None
    isInput: bool = False
    numNodes: int = 0
    colorIndex: int = 9

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return NodeCollection(id = data["id"], x = data["x"], isInput = data["isInput"], numNodes = data["numNodes"], colorIndex = data["colorIndex"])

    @classmethod
    def is_node_collection(cls, data: dict) -> bool:
        return "id" in data and "x" in data and "isInput" in data and "numNodes" in data and "colorIndex" in data