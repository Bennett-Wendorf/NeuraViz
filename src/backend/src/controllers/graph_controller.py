#region Imports
# System
from typing import List
import os
from pathlib import Path

# Quart
import quart
from quart import Blueprint
from quart import request, abort

# Models
from src.models.graph.Node import Node
from src.models.graph.Link import Link
from src.models.graph.Graph import Graph
#endregion

graph_controller_blueprint = Blueprint('graph_controller', __name__)

LAYER_MARGIN = 2
NODE_MARGIN = 1

MODEL_UPLOAD_PATH = (Path(__file__).parent.parent / "model_uploads/").resolve()

# TODO: Disallow md
ALLOWED_EXTENSIONS = ['pth', 'md']

positionless_nodes = [
    [
        Node(id = 0, bias = 1),
        Node(id = 1, bias = 1),
        Node(id = 2, bias = 1),
        Node(id = 3, bias = 1),
        Node(id = 4, bias = 1),
    ], [
        Node(id = 5, bias = 1),
        Node(id = 6, bias = 1),
        Node(id = 7, bias = 1),
        Node(id = 8, bias = 1),
    ], [
        Node(id = 9, bias = 1),
        Node(id = 10, bias = 1),
        Node(id = 11, bias = 1),
    ], [
        Node(id = 12, bias = 1),
        Node(id = 13, bias = 1),
    ]
]


@graph_controller_blueprint.post('/')
async def get_graph():
    files = await request.files
    if files:
        file = files['files[]']

        file_extension = file.filename.split('.')[-1]
        if file_extension not in ALLOWED_EXTENSIONS:
            print("Invalid file extension")
            abort(400, "Invalid file extension")

        match file_extension:
            case 'pth':
                await file.save(f"{MODEL_UPLOAD_PATH}{file.filename}.upload")
                graph = Graph.from_pytorch(f"{MODEL_UPLOAD_PATH}{file.filename}.upload")
                os.remove(f"{MODEL_UPLOAD_PATH}{file.filename}.upload")
                if graph is None:
                    print("Invalid file")
                    abort(400, "Invalid file")
                else:
                    return {'graph': graph}, 200
            case _:
                return {'graph': Graph(nodes = position_nodes(positionless_nodes), links = generate_links(positionless_nodes))}, 200
    else:
        print("No file uploaded") # TODO: Log this
        abort(400, "No file uploaded")

def generate_links(nodes: List[List[Node]]) -> List[Link]:
    links = []
    for layer in range(len(nodes) - 1):
        for node in range(len(nodes[layer])):
            links.extend([Link(source = nodes[layer][node].id, target = nodes[layer + 1][i].id, weight = 1) for i in range(len(nodes[layer + 1]))])
    return links

def position_nodes(nodes: List[List[Node]]) -> List[Node]:
    positioned_nodes = []

    middle_layer_index = (len(nodes) - 1) / 2
    for index, layer in enumerate(nodes):
        layer_offset = (index - middle_layer_index) * LAYER_MARGIN
        middle_node_index = (len(layer) - 1) / 2
        for node_index, node in enumerate(layer):
            node_offset = (node_index - middle_node_index) * NODE_MARGIN
            positioned_nodes.append(Node(id = node.id, bias = node.bias, x = layer_offset, y = node_offset))

    return positioned_nodes