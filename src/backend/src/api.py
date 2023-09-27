#region Imports
# System
import os

# Quart
from quart import Quart, send_from_directory

#Controllers
from src.controllers.graph_controller import graph_controller_blueprint as graph_controller
#endregion

app = Quart(__name__)

DEBUG = False
PORT = 5000

API_PREFIX = "/api"

app.register_blueprint(graph_controller, url_prefix = f'{API_PREFIX}/graph')

# Main page
@app.route('/')
async def index():
    return await send_from_directory('../frontend/dist', 'index.html')

# Static files
@app.route('/<path:path>')
async def home(path):
    return await send_from_directory('../frontend/dist', path)

def run(debug = DEBUG, port = PORT) -> None:
    if debug:
        app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # This prevents caching so that changes to the frontend are reflected immediately
    app.run(debug=debug, port=port)

def run_dev() -> None:
    run(debug = True)

if __name__ == "__main__":
    run(debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")