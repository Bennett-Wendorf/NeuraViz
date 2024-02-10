from dataclasses import dataclass
from typing import Self


@dataclass
class Activation:
    function: str
    category: str
    xPosition: float

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return Activation(function = data["function"], category = data["category"], xPosition = data["xPosition"])