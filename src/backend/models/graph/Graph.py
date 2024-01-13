#region imports
#region Python
from dataclasses import dataclass
from typing import List, Tuple
import os
#endregion

#region ML Frameworks
import torch
from torch.nn.modules.module import Module
import keras
#endregion

#region Models
from models.graph.Node import Node
from models.graph.Link import Link
from models.graph.Position import Position
from models.graph.Activation import Activation
from models.graph.NodeCollection import NodeCollection
from models.graph.LinkCollection import LinkCollection
#endregion

#region Helpers
from logger.logger import build_logger
from utils.activation_category_mapper import get_activation_function_category
#endregion
#endregion

# Constants TODO: Make these configurable
LAYER_MARGIN = 2.5 # The amount of horizontal space between layers
NODE_MARGIN = 1 # The amount of vertical space between nodes 
MAX_LAYER_NODES = 10 # The maximum number of nodes to display per layer. Any more than this and the layer will collapse

logger = build_logger(logger_name = "Graph", debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

@dataclass
class Graph:
    nodes: List[Node | NodeCollection]
    links: List[Link | LinkCollection]
    activations: List[Activation]

    # TODO: Try to modularize this
    @classmethod
    def from_pytorch(cls, pytorch_model_file: str):
        logger.debug("Generating model visualization from Pytorch model")
        try:
            # Generate the graph to later append data to
            new_graph = cls(nodes = [], links = [], activations = [])
            
            # Load the pytorch model
            pytorch_model = torch.load(pytorch_model_file, map_location = 'cpu')
            logger.debug(f"Load model from file: {'success' if pytorch_model is not None else 'fail'}")

            # Get the network structure and the modules
            modules = list(pytorch_model.modules())
            network_structure = modules[0] # TODO: Use this to determine basic structure (i.e. sequential, convolutional, recurrent, etc.)
            modules = modules[1:]
            
            # Calculate middle layer index for positioning
            middle_layer_index = (len([module for module in modules if not cls._is_activation_layer(module)])) / 2

            # Since the input layer is implicit, we need to add it manually
            input_layer_is_collapsed, input_layer_nodes, input_layer_links = cls._get_input_layer_nodes_and_links(modules[0].in_features, middle_layer_index)
            new_graph.nodes.extend(input_layer_nodes)
            new_graph.links.extend(input_layer_links)

            layer_index = 1
            previous_layer_nodes = input_layer_nodes
            previous_layer_is_collapsed = input_layer_is_collapsed
            for module_index, module in enumerate(modules):
                if cls._is_torch_activation_layer(module):
                    function = module.__class__.__name__
                    position = ((layer_index - 1 - middle_layer_index) * LAYER_MARGIN) + (LAYER_MARGIN / 4)
                    new_graph.activations.append(Activation(function = function, category = get_activation_function_category(function), xPosition = position))
                    continue
                
                # Calculate the layer offset (how much and which direction to positionally offset this layer from center)
                layer_offset = (layer_index - middle_layer_index) * LAYER_MARGIN

                # Calculate the middle node index for positioning
                middle_node_index = (len(module.bias.data) - 1) / 2

                # TODO: Right now this only supports linear layers, so add error checks (and eventually support) for other types
                # TODO: Add validation that in_features and out_features of previous match
                layer_nodes = []
                # Validate the the network isn't too large to be displayed (limit to MAX_LAYER_NODES nodes per layer)
                is_collapsed = len(module.bias.data) > MAX_LAYER_NODES

                if is_collapsed:
                    layer_nodes.append(NodeCollection(x = layer_offset, numNodes = len(module.bias.data)))
                else:
                    for node_index, node_bias in enumerate(module.bias.data):
                        # Calculate the node offset (how much and which direction to positionally offset this node from center)
                        node_offset = (node_index - middle_node_index) * NODE_MARGIN

                        # Create the node and add it to the graph
                        layer_nodes.append(Node(bias = float(node_bias), x = layer_offset, y = node_offset))
                
                new_graph.nodes.extend(layer_nodes)
                
                # Generate the links between the previous layer and the current layer
                if is_collapsed and previous_layer_is_collapsed:
                    new_graph.links.append(
                        LinkCollection(
                            source=previous_layer_nodes[0],
                            target=layer_nodes[0],
                            numLinks=len(previous_layer_nodes),
                        )
                    )
                elif is_collapsed:
                    new_links = [
                        LinkCollection(
                            source=previous_layer_nodes[index],
                            target=layer_nodes[0],
                            numLinks=len(layer_nodes)
                        )
                        for index in range(len(previous_layer_nodes))
                    ]
                    new_graph.links.extend(new_links)
                elif previous_layer_is_collapsed:
                    new_links = [
                        LinkCollection(
                            source=previous_layer_nodes[0],
                            target=layer_nodes[index],
                            numLinks=len(previous_layer_nodes)
                        )
                        for index in range(len(layer_nodes))
                    ]
                    new_graph.links.extend(new_links)
                else:
                    new_links = [
                        Link(
                            source=previous_layer_nodes[weight_index],
                            target=layer_nodes[weight_layer_index],
                            weight=float(previous_layer_edge)
                        )
                        for weight_layer_index, current_layer_weights in enumerate(module.weight.data.numpy())
                        for weight_index, previous_layer_edge in enumerate(current_layer_weights)
                    ]
                    new_graph.links.extend(new_links)

                previous_layer_nodes = layer_nodes
                previous_layer_is_collapsed = is_collapsed
                layer_index += 1

                # Add output links to the last layer
                if module_index == len(modules) - 1: # Only do this for the last layer
                    for node in layer_nodes:
                        new_graph.links.append(Link(source = node, target = Position(x = node.x + NODE_MARGIN, y = node.y), weight = 0, hasDirection=True))
            
            return new_graph
        except Exception as e:
            logger.error(e)
            return None


    @classmethod
    def from_keras(cls, keras_model_file: str):
        logger.debug("Generating model visualization from Keras model")
        try:
            # Generate the graph to later append data to
            new_graph = cls(nodes = [], links = [], activations = [])
            
            # Load the Keras model
            keras_model = keras.models.load_model(keras_model_file)
            logger.debug(f"Load model from file: {'success' if keras_model is not None else 'fail'}")

            # Get the network structure and the modules
            modules = keras_model.layers
            # TODO: Check type of model object to determine basic structure (i.e. sequential, convolutional, recurrent, etc.)
            
            # Calculate middle layer index for positioning
            middle_layer_index = len(modules) / 2

            # Since the input layer is implicit, we need to add it manually
            input_layer_is_collapsed, input_layer_nodes, input_layer_links = cls._get_input_layer_nodes_and_links(modules[0].kernel.shape[0], middle_layer_index)
            new_graph.nodes.extend(input_layer_nodes)
            new_graph.links.extend(input_layer_links)

            layer_index = 1
            previous_layer_nodes = input_layer_nodes
            previous_layer_is_collapsed = input_layer_is_collapsed
            for module_index, module in enumerate(modules):
                # Calculate the layer offset (how much and which direction to positionally offset this layer from center)
                layer_offset = (layer_index - middle_layer_index) * LAYER_MARGIN

                num_nodes = module.kernel.shape[1]

                # Calculate the middle node index for positioning
                middle_node_index = (num_nodes - 1) / 2

                # TODO: Right now this only supports linear layers, so add error checks (and eventually support) for other types
                # TODO: Add validation that in_features and out_features of previous match
                layer_nodes = []
                # Validate the the network isn't too large to be displayed (limit to MAX_LAYER_NODES nodes per layer)
                is_collapsed = num_nodes > MAX_LAYER_NODES

                if is_collapsed:
                    layer_nodes.append(NodeCollection(x = layer_offset, numNodes = num_nodes))
                else:
                    for node_index, node_bias in enumerate(module.bias.numpy()):
                        # Calculate the node offset (how much and which direction to positionally offset this node from center)
                        node_offset = (node_index - middle_node_index) * NODE_MARGIN

                        # Create the node and add it to the graph
                        layer_nodes.append(Node(bias = float(node_bias), x = layer_offset, y = node_offset))
                
                new_graph.nodes.extend(layer_nodes)

                # Generate the links between the previous layer and the current layer
                if is_collapsed and previous_layer_is_collapsed:
                    new_graph.links.append(
                        LinkCollection(
                            source=previous_layer_nodes[0],
                            target=layer_nodes[0],
                            numLinks=len(previous_layer_nodes),
                        )
                    )
                elif is_collapsed:
                    new_links = [
                        LinkCollection(
                            source=previous_layer_nodes[index],
                            target=layer_nodes[0],
                            numLinks=len(layer_nodes)
                        )
                        for index in range(len(previous_layer_nodes))
                    ]
                    new_graph.links.extend(new_links)
                elif previous_layer_is_collapsed:
                    new_links = [
                        LinkCollection(
                            source=previous_layer_nodes[0],
                            target=layer_nodes[index],
                            numLinks=len(previous_layer_nodes)
                        )
                        for index in range(len(layer_nodes))
                    ]
                    new_graph.links.extend(new_links)
                else:
                    new_links = [
                        Link(
                            source=previous_layer_nodes[weight_layer_index],
                            target=layer_nodes[weight_index],
                            weight=float(previous_layer_edge)
                        )
                        for weight_layer_index, current_layer_weights in enumerate(module.kernel.numpy())
                        for weight_index, previous_layer_edge in enumerate(current_layer_weights)
                    ]
                    new_graph.links.extend(new_links)

                previous_layer_nodes = layer_nodes
                previous_layer_is_collapsed = is_collapsed
                layer_index += 1

                # Add output links to the last layer
                if module_index == len(modules) - 1: # Only do this for the last layer
                    for node in layer_nodes:
                        new_graph.links.append(Link(source = node, target = Position(x = node.x + NODE_MARGIN, y = node.y), weight = 0, hasDirection=True))

                activation_function_name = module.activation.__name__
                position = ((layer_index - 1 - middle_layer_index) * LAYER_MARGIN) + (LAYER_MARGIN / 4)
                new_graph.activations.append(Activation(function = activation_function_name, category = get_activation_function_category(activation_function_name), xPosition = position))

            return new_graph
        except Exception as e:
            logger.error(e)
            return None
    
    @classmethod
    def _is_torch_activation_layer(cls, module: Module) -> bool:
        all_activations = torch.nn.modules.activation.__all__

        return module.__class__.__name__ in all_activations

    @classmethod
    def _get_input_layer_nodes_and_links(cls, num_input_nodes: int, middle_layer_index: int) -> Tuple[List[Node], List[Link]]:
        nodes, links = [], []

        input_layer_size = num_input_nodes
        is_collapsed = input_layer_size > MAX_LAYER_NODES

        input_layer_offset = (0 - middle_layer_index) * LAYER_MARGIN

        if is_collapsed:
            # Create the collapsed input layer node and add it to the graph
            new_node_collection = NodeCollection(x = input_layer_offset, isInput = True, numNodes = input_layer_size)
            nodes.append(new_node_collection)

            links.append(LinkCollection(source = Position(x = input_layer_offset - NODE_MARGIN, y = 0), target = new_node_collection, hasDirection = True, isInput = True, numLinks = input_layer_size))
            return is_collapsed, nodes, links

        # Calculate the middle node index for positioning
        input_layer_middle_node_index = (input_layer_size - 1) / 2

        for node_index in range(input_layer_size):
            # Calculate the node offset (how much and which direction to positionally offset this node from center)
            node_offset = (node_index - input_layer_middle_node_index) * NODE_MARGIN

            # Create the node and add it to the graph
            new_node = Node(x = input_layer_offset, y = node_offset, isInput = True)
            nodes.append(new_node)

            links.append(Link(source = Position(x = input_layer_offset - NODE_MARGIN, y = node_offset), target = new_node, weight = 0, hasDirection = True, isInput = True))

        return is_collapsed, nodes, links