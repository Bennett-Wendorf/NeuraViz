An Introduction on Neural networks
==================================

.. note::
    This section provides a basic introduction to what neural networks are and how they work. That being said, it is by no means a comprehensive guide. Without a more in-depth understanding of neural networks, NeuraViz isn't as useful. There are a multitude of resources online, but one good place to start would be the book `Neural Networks and Deep Learning <http://neuralnetworksanddeeplearning.com/>`_ by Michael Nielsen.

Neural networks are a type of machine learning model that are inspired by the human brain. They are made up of layers of neurons that are connected to each other. Each layer of neurons takes in a number of inputs, processes them, and then outputs a value. The value that is output is then passed to the next layer of neurons, and so on, until the final layer of neurons outputs the final result.

Neurons
-------
In an artificial neural network, neurons are the primary elements of the network that perform computations. They are organized into groups called layers, typically represented in a graph structure organized vertically so the neurons in a layer are in a sort of column. Typically, the first layer is called the input layer, and behaves differently than other layers. For this reason, input neurons are represented as grey squares in NeuraViz as opposed to the typical neurons' circles. Neurons run the computations needed for the network to process input (details can be found in `Neural Networks and Deep Learning <http://neuralnetworksanddeeplearning.com/>`_). In general, neurons in a layer are directionally linked to all the neurons in the previous layer, and all the neurons in the next layer, with data traveling on these links from one layer to the next. These connections are represented as directed lines between the neurons in NeuraViz.

Edges
-----
Edges are the connections between neurons in a neural network. They are the primary way that information is passed between neurons. In NeuraViz, edges are represented as directed lines between neurons. Edges also have weights, which are used in the computation to determine how important that connection is. For small enough networks, the weights can be seen by hovering over edges in NeuraViz.

Activation Functions
--------------------
Activation functions are a key part of how neural networks work. They are used to determine the output of a neuron based on the inputs it receives. There are many different activation functions, but one of the most common ones is the sigmoid function. The sigmoid function takes in a number and returns a number between 0 and 1. This is useful because it allows the network to output a value that can be interpreted as a probability. In NeuraViz, activation functions are shown at the layer-level and represented as icons near the top of each layer. Hovering over these icons will show the activation function used in that layer.