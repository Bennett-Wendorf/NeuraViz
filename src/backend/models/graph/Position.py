from dataclasses import dataclass
from typing import Optional, Self

@dataclass
class Position:
    x: float
    y: float

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return Position(x = data["x"], y = data["y"])

    @classmethod
    def is_position(cls, data: dict) -> bool:
        return "x" in data and "y" in data