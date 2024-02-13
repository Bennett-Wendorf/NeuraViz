#region imports
#region Python
from dataclasses import dataclass
from typing import List, Tuple, Callable, Iterable, Self
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
from utils.color_helper import populate_color_indexes
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

    def to_dict(self):
        return {
            "nodes": [node.__dict__ for node in self.nodes],
            "links": [link.to_dict() for link in self.links],
            "activations": [activation.__dict__ for activation in self.activations]
        }

    @classmethod
    def from_dict(cls, dict: dict) -> Self:
        if dict is None:
            return None
        return Graph(
            nodes = [Node.from_dict(node) if Node.is_node(node) else NodeCollection.from_dict(node) for node in dict["nodes"]], 
            links = [Link.from_dict(link) if Link.is_link(link) else LinkCollection.from_dict(link) for link in dict["links"]], 
            activations = [Activation.from_dict(activation) for activation in dict["activations"]]
        )

    @classmethod
    def from_pytorch(cls, pytorch_model_file: str) -> Self:
        logger.debug("Generating model visualization from Pytorch model")

        def load_model(model_file):
            return torch.load(model_file, map_location = 'cpu')

        def get_modules(model):
            return list(model.modules())[1:]

        def get_input_size(modules):
            return modules[0].in_features

        def get_module_count(modules):
            return len([module for module in modules if not cls._is_torch_activation_layer(module)])

        def module_skipper(module, graph: Self, layer_index: int, middle_layer_index: int):
            should_skip = cls._is_torch_activation_layer(module)
            if should_skip:
                function = module.__class__.__name__
                position = ((layer_index - 1 - middle_layer_index) * LAYER_MARGIN) + (LAYER_MARGIN / 4)
                graph.activations.append(Activation(function = function, category = get_activation_function_category(function), xPosition = position))
            
            return should_skip, None

        def get_module_size(module):
            return len(module.bias.data)

        def get_bias(module):
            return module.bias.data

        def get_weights(module):
            return module.weight.data.numpy()

        return cls._build_graph(pytorch_model_file, load_model, get_modules, get_input_size,
            get_module_count, module_skipper, get_module_size, get_bias, get_weights)

    @classmethod
    def from_keras(cls, keras_model_file: str) -> Self:
        logger.debug("Generating model visualization from Keras model")

        def get_modules(model):
            return model.layers

        def get_input_size(modules):
            return cls._get_keras_first_kernel_module(modules).kernel.shape[0]

        def get_module_count(modules):
            return len(modules)

        def module_skipper(module, graph: Graph, layer_index: int, middle_layer_index: int):
            should_skip = not hasattr(module, 'kernel')
            return should_skip, module.activation.__name__ if not should_skip else None

        def get_module_size(module):
            return module.kernel.shape[1]
        
        def get_bias(module):
            return module.bias.numpy()

        def get_weights(module):
            return module.kernel.numpy()

        return cls._build_graph(keras_model_file, keras.models.load_model, get_modules, 
            get_input_size, get_module_count, module_skipper, get_module_size, get_bias, 
            get_weights, reverse_weights = True)
    
    @classmethod
    def _is_torch_activation_layer(cls, module: Module) -> bool:
        all_activations = torch.nn.modules.activation.__all__

        return module.__class__.__name__ in all_activations

    @classmethod
    def _get_keras_first_kernel_module(cls, modules: List[keras.layers.Layer]) -> keras.layers.Layer:
        for module in modules:
            if hasattr(module, 'kernel'):
                return module

        return None

    @classmethod
    def _get_input_layer_nodes_and_links(cls, num_input_nodes: int, middle_layer_index: int) -> Tuple[List[Node], List[Link]]:
        nodes, links = [], []

        input_layer_size = num_input_nodes
        is_collapsed = input_layer_size > MAX_LAYER_NODES

        input_layer_offset = (0 - middle_layer_index) * LAYER_MARGIN

        if is_collapsed:
            # Create the collapsed input layer node and add it to the graph
            new_node_collection = NodeCollection(id = -1, x = input_layer_offset, isInput = True, numNodes = input_layer_size)
            nodes.append(new_node_collection)

            links.append(LinkCollection(source = Position(x = input_layer_offset - NODE_MARGIN, y = 0), target = new_node_collection, hasDirection = True, isInput = True, numLinks = input_layer_size))
            return is_collapsed, nodes, links

        # Calculate the middle node index for positioning
        input_layer_middle_node_index = (input_layer_size - 1) / 2

        for node_index in range(input_layer_size):
            # Calculate the node offset (how much and which direction to positionally offset this node from center)
            node_offset = (node_index - input_layer_middle_node_index) * NODE_MARGIN

            # Create the node and add it to the graph
            new_node = Node(id = -1, x = input_layer_offset, y = node_offset, isInput = True)
            nodes.append(new_node)

            links.append(Link(source = Position(x = input_layer_offset - NODE_MARGIN, y = node_offset), target = new_node, weight = 0, hasDirection = True, isInput = True))

        return is_collapsed, nodes, links

    @classmethod
    def _build_graph(cls, model_file: str, model_loader: Callable[[str], object], modules_accessor: Callable[[object], List[object]],
        input_size_accessor: Callable[[object], int], module_count_accessor: Callable[[object], int], 
        module_skipper: Callable[[object, Self, int, int], Tuple[bool, str]], module_size_accessor: Callable[[object], int],
        bias_accessor: Callable[[object], Iterable[float]], weight_accessor: Callable[[object], Iterable[float]], reverse_weights: bool = False) -> Self:
        node_id = 0
        # try:
        # Generate the graph to later append data to
        new_graph = cls(nodes = [], links = [], activations = [])
        
        # Load the model
        model = model_loader(model_file)
        logger.debug(f"Load model from file: {'success' if model is not None else 'fail'}")

        # Get the network structure and the modules
        modules = modules_accessor(model)
        # TODO: Determine basic structure (i.e. sequential, convolutional, recurrent, etc.)
        
        # Calculate middle layer index for positioning
        middle_layer_index = module_count_accessor(modules) / 2

        # Since the input layer is implicit, we need to add it manually
        input_layer_is_collapsed, input_layer_nodes, input_layer_links = cls._get_input_layer_nodes_and_links(input_size_accessor(modules), middle_layer_index)
        for node in input_layer_nodes:
            node.id = node_id
            node_id += 1
        new_graph.nodes.extend(input_layer_nodes)
        new_graph.links.extend(input_layer_links)

        layer_index = 1
        previous_layer_nodes = input_layer_nodes
        previous_layer_is_collapsed = input_layer_is_collapsed
        for module_index, module in enumerate(modules):
            # Skip some modules
            should_skip_module, activation_function_name = module_skipper(module, new_graph, layer_index, middle_layer_index)
            if should_skip_module:
                continue

            if (activation_function_name is not None):
                position = ((layer_index - middle_layer_index) * LAYER_MARGIN) + (LAYER_MARGIN / 4)
                new_graph.activations.append(Activation(function = activation_function_name, category = get_activation_function_category(activation_function_name), xPosition = position))

            # Calculate the layer offset (how much and which direction to positionally offset this layer from center)
            layer_offset = (layer_index - middle_layer_index) * LAYER_MARGIN

            num_nodes = module_size_accessor(module)

            # Calculate the middle node index for positioning
            middle_node_index = (num_nodes - 1) / 2

            # TODO: Right now this only supports linear layers, so add error checks (and eventually support) for other types
            # TODO: Add validation that in_features and out_features of previous match
            layer_nodes = []
            # Validate the the network isn't too large to be displayed (limit to MAX_LAYER_NODES nodes per layer)
            is_collapsed = num_nodes > MAX_LAYER_NODES

            if is_collapsed:
                layer_nodes.append(NodeCollection(id = node_id, x = layer_offset, numNodes = num_nodes))
                node_id += 1
            else:
                for node_index, node_bias in enumerate(bias_accessor(module)):
                    # Calculate the node offset (how much and which direction to positionally offset this node from center)
                    node_offset = (node_index - middle_node_index) * NODE_MARGIN

                    # Create the node and add it to the graph
                    layer_nodes.append(Node(id = node_id, bias = float(node_bias), x = layer_offset, y = node_offset))
                    node_id += 1
            
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
                        source=previous_layer_nodes[weight_layer_index if reverse_weights else weight_index],
                        target=layer_nodes[weight_index if reverse_weights else weight_layer_index],
                        weight=float(previous_layer_edge)
                    )
                    for weight_layer_index, current_layer_weights in enumerate(weight_accessor(module))
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

        max_bias, max_weight = new_graph._get_max_abs_values()
        populate_color_indexes(new_graph, max_bias, max_weight)

        return new_graph
        # except Exception as e:
        #     logger.error(e)
        #     return None

    def _get_max_abs_values(self) -> Tuple[float, float]:
        max_bias = max([abs(node.bias) if isinstance(node, Node) and not node.isInput else 0 for node in self.nodes])
        max_weight = max([abs(link.weight) if isinstance(link, Link) and not link.isInput else 0 for link in self.links])
        return max_bias, max_weight