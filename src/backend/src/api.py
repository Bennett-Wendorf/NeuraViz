#region Imports
# System
import os
from pathlib import Path


# Quart
from quart import Quart, send_from_directory

# Dotenv
from dotenv import load_dotenv
load_dotenv()

#Controllers
from src.controllers.graph_controller import graph_controller_blueprint as graph_controller

# Utils
from src.logger.logger import build_logger
#endregion

app = Quart(__name__)

DEFAULT_DEBUG = False
PORT = 5000

API_PREFIX = "/api"

logger = build_logger(debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

app.register_blueprint(graph_controller, url_prefix = f'{API_PREFIX}/graph')

# Main page
@app.route('/')
async def index():
    return await send_from_directory((Path(__file__).resolve().parent.parent.parent / "frontend/dist").resolve(), 'index.html')

# Static files
@app.route('/<path:path>')
async def home(path):
    return await send_from_directory((Path(__file__).resolve().parent.parent.parent / "frontend/dist").resolve(), path)

def run(port = PORT) -> None:
    # TODO: Change this environment variable to be more specific to the application
    debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE"

    if debug:
        app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # This prevents caching so that changes to the frontend are reflected immediately

    app.run(debug=debug, port=port)

if __name__ == "__main__":
    run()