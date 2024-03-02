An Introduction on Neural networks
==================================

.. note::
    This section provides a basic introduction to what neural networks are and how they work. That being said, it is by no means a comprehensive guide. Without a more in-depth understanding of neural networks, NeuraViz isn't as useful. There are a multitude of resources online, but one good place to start would be the book `Neural Networks and Deep Learning <http://neuralnetworksanddeeplearning.com/>`_ by Michael Nielsen.

Neural networks are a type of machine learning model that are inspired by the human brain. They are made up of layers of neurons, which are connected to each other. Each layer of neurons takes in a number of inputs, processes them, and then outputs a value. The value that is output is then passed to the next layer of neurons, and so on, until the final layer of neurons outputs the final result.

Neurons
-------
In an artificial neural network, neurons are the primary pieces of the network that perform the computation necessary. They are organized into groups called layers, typically represented in a graph structure organized vertically so the neurons in a layer are in a sort of column. Typically, the first layer is called the input layer, and behaves a little differently than other layers. For this reason, input neurons are represented as grey squares in NeuraViz as opposed to the typical neuron's circle. Neurons run the computations needed for the network to function with complex algorithms that I'll skip over here for simplicity. In general, neurons in a layer are connected to all the neurons in the previous layer, and all the neurons in the next layer. These connections are represented as lines between the neurons in NeuraViz.