from dataclasses import dataclass

@dataclass
class Node:
    id: int
    test_value: int
    x: float = None
    y: float = None