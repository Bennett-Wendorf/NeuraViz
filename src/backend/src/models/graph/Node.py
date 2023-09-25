from dataclasses import dataclass

@dataclass
class Node:
    id: int
    bias: float
    x: float = None
    y: float = None