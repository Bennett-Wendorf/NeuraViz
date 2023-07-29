from quart import Quart, send_from_directory

app = Quart(__name__)

API_PREFIX = "/api"
LAYER_MARGIN = 2
NODE_MARGIN = 1

positionless_nodes = [
    [
        {"id": 0, "test_value": 1},
        {"id": 1, "test_value": 1},
        {"id": 2, "test_value": 1},
        {"id": 3, "test_value": 1},
        {"id": 4, "test_value": 1},
    ], [
        {"id": 5, "test_value": 1},
        {"id": 6, "test_value": 1},
        {"id": 7, "test_value": 1},
        {"id": 8, "test_value": 1},
    ], [
        {"id": 9, "test_value": 1},
        {"id": 10, "test_value": 1},
        {"id": 11, "test_value": 1},
    ], [
        {"id": 12, "test_value": 1},
        {"id": 13, "test_value": 1},
    ]
]

# Main page
@app.route('/')
async def index():
    return await send_from_directory('../frontend/dist', 'index.html')

# Static files
@app.route('/<path:path>')
async def home(path):
    return await send_from_directory('../frontend/dist', path)


@app.route(f'{API_PREFIX}/graph')
def get_graph():
    return {"nodes": position_nodes(positionless_nodes), "links": generate_links(positionless_nodes)}

def generate_links(nodes: list):
    links = []
    for layer in range(len(nodes) - 1):
        for node in range(len(nodes[layer])):
            links.extend([{"source": nodes[layer][node]["id"], "target": nodes[layer + 1][i]["id"]} for i in range(len(nodes[layer + 1]))])
    return links

def position_nodes(nodes: list):
    positioned_nodes = []

    middle_layer_index = (len(nodes) - 1) / 2
    for index, layer in enumerate(nodes):
        layer_offset = (index - middle_layer_index) * LAYER_MARGIN
        middle_node_index = (len(layer) - 1) / 2
        for node_index, node in enumerate(layer):
            node_offset = (node_index - middle_node_index) * NODE_MARGIN
            positioned_nodes.append({"id": node["id"], "x": layer_offset, "y": node_offset})

    return positioned_nodes


if __name__ == "__main__":
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # This prevents caching so that changes to the frontend are reflected immediately
    app.run(debug=True)