from dataclasses import dataclass
from typing import Optional

@dataclass
class NodeCollection:
    x: float = None
    isInput: bool = False
    numNodes: int = 0