import math
from typing import Callable, Tuple, List
from models.graph.Node import Node
from models.graph.Link import Link

_link_color_values = [
    ("link50", "e6f8fb"),
    ("link100", "cdf0f6"),
    ("link200", "b4e9f2"),
    ("link300", "9be2ee"),
    ("link400", "82daea"),
    ("link500", "6ad3e5"),
    ("link600", "51cce1"),
    ("link700", "38c5dd"),
    ("link800", "1fbdd8"),
    ("link900", "06b6d4")
]

_dark_link_color_values = [
    ("link50", "011215"),
    ("link100", "01242a"),
    ("link200", "023740"),
    ("link300", "024955"),
    ("link400", "035b6a"),
    ("link500", "046d7f"),
    ("link600", "047f94"),
    ("link700", "0592aa"),
    ("link800", "05a4bf"),
    ("link900", "06b6d4")
]

_node_color_values = [
    ("node50", "faf0ff"),
    ("node100", "f5e0ff"),
    ("node200", "f0d1ff"),
    ("node300", "ebc2ff"),
    ("node400", "e6b2ff"),
    ("node500", "e0a3ff"),
    ("node600", "db94ff"),
    ("node700", "d685ff"),
    ("node800", "d175ff"),
    ("node900", "cc66ff")
]

_dark_node_color_values = [
    ("node50", "140a1a"),
    ("node100", "291433"),
    ("node200", "3d1f4c"),
    ("node300", "522966"),
    ("node400", "663380"),
    ("node500", "7a3d99"),
    ("node600", "8f47b2"),
    ("node700", "a352cc"),
    ("node800", "b85ce6"),
    ("node900", "cc66ff")
]

def get_all_color_values(is_dark_mode: bool) -> Tuple[List[Tuple[str, str]], List[Tuple[str, str]]]:
    return (_dark_link_color_values, _dark_node_color_values) if is_dark_mode else (_link_color_values, _node_color_values)

def get_node_color_name(index: int) -> str:
    return _node_color_values[index][0]

def get_link_color_name(index: int) -> str:
    return _link_color_values[index][0]

def populate_color_indexes(graph, max_bias: float, max_weight: float):
    bias_scaled_absolute_tanh = _get_scaled_absolute_tanh(max_bias)
    weight_scaled_absolute_tanh = _get_scaled_absolute_tanh(max_weight)

    for node in graph.nodes:
        if isinstance(node, Node) and not node.isInput:
            node.colorIndex = _get_color_index(node.bias, bias_scaled_absolute_tanh)
        elif node.isInput:
            node.colorIndex = -1
    
    for link in graph.links:
        if isinstance(link, Link) and not link.hasDirection:
            link.colorIndex = _get_color_index(link.weight, weight_scaled_absolute_tanh)
        elif link.hasDirection:
            link.colorIndex = -1

def _get_scaled_absolute_tanh(maxAbs: float) -> Callable[float, float]:
    if (maxAbs == 0):
        return lambda value: 0
    
    return lambda value: _absolute_tanh(value * (2/maxAbs)) # The two here comes from the location that tanh gets pretty close to 1 (visually)

def _absolute_tanh(value: float) -> float:
    return abs(math.tanh(value))

def _get_color_index(value: float, absolute_tanh: Callable[[float], float]) -> int:
    return round(absolute_tanh(value) * 9) # 9 is number of colors - 1