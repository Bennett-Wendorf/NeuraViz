from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    bias: Optional[float] = None
    x: float = None
    y: float = None