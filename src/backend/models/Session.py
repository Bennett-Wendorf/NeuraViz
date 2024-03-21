from models.graph.Graph import Graph
from datetime import datetime
from typing import List, Self
from dataclasses import dataclass
import uuid

@dataclass
class Session:
    session_id: str
    graphs: List[Graph]
    last_used: datetime

    def __init__(self, session_id: str = None, graphs: List[Graph] = [], last_used: datetime = datetime.now()):
        self.session_id = session_id
        self.graphs = graphs
        self.last_used = last_used

    def to_dict(self):
        return {
            "graphs": [graph.to_dict() for graph in self.graphs],
            "last_used": self.last_used
        }

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        if data is None:
            return None
        return Session(session_id = str(data["_id"]), graphs = data["graphs"], last_used = data["last_used"])