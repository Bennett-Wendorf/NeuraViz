from dataclasses import dataclass
from typing import List
from src.models.graph.Node import Node
from src.models.graph.Link import Link
import torch
from torch.nn.modules.module import Module
from src.logger.logger import build_logger
import os

# Constants TODO: Make these configurable
LAYER_MARGIN = 2 # The amount of horizontal space between layers
NODE_MARGIN = 1 # The amount of vertical space between nodes 

logger = build_logger(logger_name = "Graph", debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

@dataclass
class Graph:
    nodes: List[Node]
    links: List[Link]

    # TODO: Try to modularize this
    @classmethod
    def from_pytorch(cls, pytorch_model_file: str):
        logger.debug("Generating model visualization from Pytorch model")
        try:
            # Generate the graph to later append data to
            new_graph = cls(nodes = [], links = [])
            
            # Load the pytorch model
            pytorch_model = torch.load(pytorch_model_file, map_location = 'cpu')
            logger.debug(f"Load model from file: {'success' if pytorch_model is not None else 'fail'}")

            # Get the network structure and the modules
            modules = list(pytorch_model.modules())
            network_structure = modules[0] # TODO: Use this to determine basic structure
            modules = modules[1:]

            # Calculate middle layer index for positioning
            middle_layer_index = (len([module for module in modules if not cls._is_activation_layer(module)])) / 2

            # Since the input layer is implicit, we need to add it manually
            input_layer_size = modules[0].in_features
            input_layer_nodes = [Node() for i in range(input_layer_size)]

            # Calculate the middle node index for positioning
            input_layer_middle_node_index = (input_layer_size - 1) / 2

            input_layer_offset = (0 - middle_layer_index) * LAYER_MARGIN

            input_layer_nodes = []
            for node_index in range(input_layer_size):
                # Calculate the node offset (how much and which direction to positionally offset this node from center)
                node_offset = (node_index - input_layer_middle_node_index) * NODE_MARGIN

                # Create the node and add it to the graph
                input_layer_nodes.append(Node(x = input_layer_offset, y = node_offset))
            new_graph.nodes.extend(input_layer_nodes)

            # TODO: Validate the the network isn't too large to be displayed

            layer_index = 1
            previous_layer_nodes = input_layer_nodes
            for module in modules:
                if cls._is_activation_layer(module):
                    # TODO: Add activation functions into graph structure for visualization as well
                    continue

                # Calculate the layer offset (how much and which direction to positionally offset this layer from center)
                layer_offset = (layer_index - middle_layer_index) * LAYER_MARGIN
                
                # Calculate the middle node index for positioning
                middle_node_index = (len(module.bias.data) - 1) / 2

                # TODO: Right now this only supports linear layers, so add error checks (and eventually support) for other types
                # TODO: Add validation that in_features and out_features of previous match
                layer_nodes = []
                for node_index, node_bias in enumerate(module.bias.data):
                    # Calculate the node offset (how much and which direction to positionally offset this node from center)
                    node_offset = (node_index - middle_node_index) * NODE_MARGIN

                    # Create the node and add it to the graph
                    layer_nodes.append(Node(bias = float(node_bias), x = layer_offset, y = node_offset))
                new_graph.nodes.extend(layer_nodes)

                # TODO: Is there a more pythonic way to do this?
                # Generate the links between the previous layer and the current layer
                for weight_layer_index, current_layer_weights in enumerate(module.weight.data):
                    for weight_index, previous_layer_edge in enumerate(current_layer_weights):
                        new_graph.links.append(Link(source = previous_layer_nodes[weight_index], target = layer_nodes[weight_layer_index], weight = float(previous_layer_edge)))

                previous_layer_nodes = layer_nodes
                layer_index += 1
            
            return new_graph
        except Exception as e:
            logger.error(e)
            return None

    @classmethod
    def _is_activation_layer(cls, module: Module) -> bool:
        all_activations = torch.nn.modules.activation.__all__

        return module.__class__.__name__ in all_activations