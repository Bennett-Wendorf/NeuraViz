from dataclasses import dataclass

@dataclass
class Link:
    source: int
    target: int
    weight: float