from dataclasses import dataclass
from src.models.graph.Node import Node

@dataclass
class Link:
    source: Node
    target: Node
    weight: float