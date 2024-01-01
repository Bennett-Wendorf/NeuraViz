from dataclasses import dataclass

@dataclass
class Activation:
    function: str
    category: str
    xPosition: float