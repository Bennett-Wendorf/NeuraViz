reluFunctions = ['relu']

def get_activation_function_category(function: str) -> str:
    if function.lower() in reluFunctions:
        return 'relu'
    else:
        return 'other'