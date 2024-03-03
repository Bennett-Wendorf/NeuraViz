Visualization in NeuraViz
=========================

In NeuraViz, neural networks architectures are visualized in a graph structure. For those familiar with mathematical graphs, the nodes in the network are the vertices of the graph, and the connections between them are the edges. Shape and color are also used to help convey information about the network, and more detailed information about many elements is also available with a hover or a click.

Navigation
----------
To assist in inspecting elements of the graph, NeuraViz allows panning and zooming of the image. The graph can be panned by clicking and dragging the mouse, and zoomed in and out using the mouse wheel. In addition to the mouse wheel, zoom in and out buttons are also available in the bottom right corner of the application.

.. figure:: res/zoom_in.png
   :align: center
   :alt: Zoom in button

   Zoom in button

.. figure:: res/zoom_out.png
   :align: center
   :alt: Zoom out button

   Zoom out button

If you ever get lost in the graph, a reset button also exists above the zoom buttons to reset both pan and zoom to their default values.

.. figure:: res/reset_zoom_pan.png
   :align: center
   :alt: Reset button

   Reset button

Node information
----------------

Nodes are represented as either circles or squares, depending on the type of node. Squares are reserved for nodes in the input layer of the network, as this layer does not perform calculations in the same way as the other layers. Because of this, input neurons also do not have biases, and therefore are colored grey instead of the range of purple used for other layers. Since they don't have biases, clicking on an input node will show a dialog stating that the node is in the input layer of the network.

Nodes in every other layer are represented as a circle in a varying shade of purple. The color of the node is determined by the value of the bias of the node, with more saturated shades having a higher bias. This is useful for quickly identifying nodes that have a large impact on the output of the network. Since the colors vary depending on the application theme, a key is also available in the bottom left of the application. Clicking on a node will display a dialog with the actual value of the bias.

For layers larger than ten nodes, NeuraViz will not display each node individually, and instead show the entire layer as a group of three circles or squares overlapping each other. Clicking on one of these node collections will display a dialog with the number of ndoes in the layer.

Edge information
----------------

Edges are represented as lines between nodes. Like nodes, the color of the edge indicates the value of the weight, with more saturated colors indicating a higher weight. These color values are also displayed in the key in the bottom left of the application. Hovering on an edge will display a tooltip with the actual value of the weight.

For edges connected to at least one layer that is collapsed, the edge will have an additional perpendicular dash at the end to indicate that the line actually represents a number of edges. Since these edges are not individually displayed, the tooltip will simply say there are multiple edges.

In addition to edges between layers, input and output edges are also provided to enhance the clarity of the graph. These edges are always grey and have arrows to indicate their direction.

Activation function information
-------------------------------

The activation function on a layer is displayed as an icon toward the top of the layer, as well as a dashed line to show where the function occurs in the process. In neural networks, activation functions are triggered after the calculations on each neuron are completed, so the dashed line renders just after the layer it is associated with. The icon represents the category of activation function used, and hovering over the icon will display a tooltip with the name of the function.

Available categories are as follows:

.. figure:: res/relu_activation.png
    :align: center
    :width: 100
    :alt: ReLU activation function
    
    ReLU activation function

.. figure:: res/logistic_activation.png
    :align: center
    :width: 100
    :alt: Logistic activation function
    
    Logistic activation function

.. figure:: res/shrink_activation.png
    :align: center
    :width: 100
    :alt: Shrink activation function
    
    Shrink activation function

.. figure:: res/threshold_activation.png
    :align: center
    :width: 100
    :alt: Threshold activation function
    
    Threshold activation function

.. figure:: res/softmax_activation.png
    :align: center
    :width: 100
    :alt: Softmax activation function
    
    Softmax activation function

.. figure:: res/general_activation.png
    :align: center
    :width: 100
    :alt: General activation function
    
    General activation function