from dataclasses import dataclass
from typing import List
from src.models.graph.Node import Node
from src.models.graph.Link import Link

@dataclass
class Graph:
    nodes: List[Node]
    links: List[Link]