from models.graph.Graph import Graph
from models.graph.Node import Node
from models.graph.NodeCollection import NodeCollection
from models.graph.Link import Link
from utils.color_helper import get_all_color_values, get_node_color_name, get_link_color_name
from typing import Tuple
import math

NODE_POSITION_SCALE_FACTOR = 2

def get_tikz_representation(graph: Graph) -> str:
    tikz = ""
    for node in graph.nodes:
        if node.isInput:
            if isinstance(node, Node):
                node_x = node.x * NODE_POSITION_SCALE_FACTOR
                node_y = node.y * NODE_POSITION_SCALE_FACTOR
                tikz += f"\\node[input_node] ({node.id}) at (\\scalevalue{{{node_x}}}, \\scalevalue{{{node_y}}}) {{}};\n"
            else:
                tikz += f"\\node[input_node] (-1) at (\\scalevalue{{{(node.x * NODE_POSITION_SCALE_FACTOR) - 0.25}}}, \\scalevalue{{0.25}}) {{}};\n"
                tikz += f"\\node[input_node] ({node.id}) at (\\scalevalue{{{node.x * NODE_POSITION_SCALE_FACTOR}}}, 0) {{}};\n"
                tikz += f"\\node[input_node] (-1) at (\\scalevalue{{{(node.x * NODE_POSITION_SCALE_FACTOR) + 0.25}}}, \\scalevalue{{-0.25}}) {{}};\n"
        else:
            if isinstance(node, Node):
                node_x = node.x * NODE_POSITION_SCALE_FACTOR
                node_y = node.y * NODE_POSITION_SCALE_FACTOR
                tikz += f"\\node[node, fill={get_node_color_name(node.colorIndex)}] ({node.id}) at (\\scalevalue{{{node_x}}}, \\scalevalue{{{node_y}}}) {{}};\n"
            else:
                tikz += f"\\node[node, fill={get_node_color_name(node.colorIndex)}] (-1) at (\\scalevalue{{{(node.x * NODE_POSITION_SCALE_FACTOR) - 0.25}}}, \\scalevalue{{0.25}}) {{}};\n"
                tikz += f"\\node[node, fill={get_node_color_name(node.colorIndex)}] ({node.id}) at (\\scalevalue{{{node.x * NODE_POSITION_SCALE_FACTOR}}}, 0) {{}};\n"
                tikz += f"\\node[node, fill={get_node_color_name(node.colorIndex)}] (-1) at (\\scalevalue{{{(node.x * NODE_POSITION_SCALE_FACTOR) + 0.25}}}, \\scalevalue{{-0.25}}) {{}};\n"
    tikz += f"\\begin{{scope}}[on background layer]\n"
    for link in sorted(graph.links, key=lambda link: link.colorIndex):
        if link.isInput:
            tikz += f"\\draw[io_link] (\\scalevalue{{{(link.source.x * NODE_POSITION_SCALE_FACTOR) - 1}}},\\scalevalue{{{link.source.y * NODE_POSITION_SCALE_FACTOR}}}) -- ({link.target.id});\n"
        elif link.hasDirection:
            tikz += f"\\draw[io_link] ({link.source.id}) -- (\\scalevalue{{{(link.target.x * NODE_POSITION_SCALE_FACTOR) + 1}}},\\scalevalue{{{link.target.y * NODE_POSITION_SCALE_FACTOR}}});\n"
        else:
            source_id = f"{link.source.id}.center" if link.source.isInput else link.source.id
            target_id = f"{link.target.id}.center" if link.target.isInput else link.target.id
            if isinstance(link, Link):
                tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] ({source_id}) -- ({target_id});\n"
            else:
                tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] ({source_id}) -- ({target_id});\n"
                if isinstance(link.source, NodeCollection) and isinstance(link.target, NodeCollection):
                    source_marker_x = f"\\scalevalue{{{l(ink.source.x * NODE_POSITION_SCALE_FACTOR) + 1.25}}}"
                    target_marker_x = f"\\scalevalue{{{link.target.x * NODE_POSITION_SCALE_FACTOR - 1.25}}}"
                    tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] ({source_marker_x}, \\scalevalue{{0.25}}) -- ({source_marker_x}, \\scalevalue{{-0.25}});\n"
                    tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] ({target_marker_x}, \\scalevalue{{0.25}}) -- ({target_marker_x}, \\scalevalue{{-0.25}});\n"
                elif isinstance(link.source, NodeCollection):
                    marker_top_x, marker_top_y, marker_bottom_x, marker_bottom_y = _calculate_marker_location(link.source.x * NODE_POSITION_SCALE_FACTOR, 0, link.target.x * NODE_POSITION_SCALE_FACTOR, link.target.y * NODE_POSITION_SCALE_FACTOR)
                    tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] (\\scalevalue{{{marker_top_x}}}, \\scalevalue{{{marker_top_y}}}) -- (\\scalevalue{{{marker_bottom_x}}}, \\scalevalue{{{marker_bottom_y}}});\n"
                elif isinstance(link.target, NodeCollection):
                    marker_top_x, marker_top_y, marker_bottom_x, marker_bottom_y = _calculate_marker_location(link.target.x * NODE_POSITION_SCALE_FACTOR, 0, link.source.x * NODE_POSITION_SCALE_FACTOR, link.source.y * NODE_POSITION_SCALE_FACTOR)
                    tikz += f"\\draw[link, draw={get_link_color_name(link.colorIndex)}] (\\scalevalue{{{marker_top_x}}}, \\scalevalue{{{marker_top_y}}}) -- (\\scalevalue{{{marker_bottom_x}}}, \\scalevalue{{{marker_bottom_y}}});\n"

    tikz += f"\\end{{scope}}\n"
    return tikz

def _calculate_marker_location(source_x: float, source_y: float, target_x: float, target_y: float) -> Tuple[float, float, float, float]:
    link_vector = (target_x - source_x, target_y - source_y)
    link_length = math.sqrt(link_vector[0] ** 2 + link_vector[1] ** 2)
    link_unit_vector = (link_vector[0] / link_length, link_vector[1] / link_length)
    perpendicular_link_unit_vector = (-link_unit_vector[1], link_unit_vector[0])
    marker_top_x = (source_x + (link_unit_vector[0] * 1.25)) + (perpendicular_link_unit_vector[0] * 0.25)
    marker_top_y = (source_y + (link_unit_vector[1] * 1.25)) + (perpendicular_link_unit_vector[1] * 0.25)
    marker_bottom_x = (source_x + (link_unit_vector[0] * 1.25)) - (perpendicular_link_unit_vector[0] * 0.25)
    marker_bottom_y = (source_y + (link_unit_vector[1] * 1.25)) - (perpendicular_link_unit_vector[1] * 0.25)
    return marker_top_x, marker_top_y, marker_bottom_x, marker_bottom_y

def get_color_definitions() -> str:
    res = ""
    link_colors, node_colors = get_all_color_values()
    for color in link_colors:
        res += f"\\definecolor{{{color[0]}}}{{HTML}}{{{color[1]}}}\n"
    for color in node_colors:
        res += f"\\definecolor{{{color[0]}}}{{HTML}}{{{color[1]}}}\n"
    return res

def get_styles() -> str:
    return """
\\tikzstyle{node}=[circle, draw=black, minimum size=\\scalevalue{1.25}cm, thick]
\\tikzstyle{input_node}=[rectangle, rounded corners=\\scalevalue{.25}cm, draw=black, minimum size=\\scalevalue{1.25}cm, thick, fill=gray]
\\tikzstyle{link}=[line width = \\scalevalue{4}pt]
\\tikzstyle{io_link}=[-latex, line width = \\scalevalue{4}pt, draw=gray]
    """    