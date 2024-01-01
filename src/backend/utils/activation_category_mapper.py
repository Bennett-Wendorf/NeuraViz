reluFunctions = ['relu', 'elu', 'hardswish', 'leakyrelu', 'prelu', 'relu6', 'rrelu', 'selu', 'celu', 'gelu', 'silu', 'mish', 'softplus']
logisticFunctions = ['sigmoid', 'hardsigmoid', 'tanh', 'hardtanh', 'softsign']
shrinkFunctions = ['softshrink', 'hardshrink', 'tanhshrink']
thresholdFunctions = ['threshold', 'logsigmoid']
softmaxFunctions = ['softmax', 'softmax2d', 'logsoftmax', 'softmin', 'adaptivelogsoftmaxwithloss']

def get_activation_function_category(function: str) -> str:
    lowerFunction = function.lower()
    if lowerFunction in reluFunctions:
        return 'relu'
    elif lowerFunction in logisticFunctions:
        return 'logistic'
    elif lowerFunction in shrinkFunctions:
        return 'shrink'
    elif lowerFunction in thresholdFunctions:
        return 'threshold'
    elif lowerFunction in softmaxFunctions:
        return 'softmax'
    else:
        return 'other'