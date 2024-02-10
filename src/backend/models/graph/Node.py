from dataclasses import dataclass
from typing import Optional, Self

@dataclass
class Node:
    id: str
    bias: Optional[float] = None
    x: float = None
    y: float = None
    isInput: bool = False

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return Node(id = data["id"], bias = data["bias"], x = data["x"], y = data["y"], isInput = data["isInput"])

    @classmethod
    def is_node(cls, data: dict) -> bool:
        return "id" in data and "bias" in data and "x" in data and "y" in data and "isInput" in data