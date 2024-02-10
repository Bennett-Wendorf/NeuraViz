#region Imports
# System
import os
from pathlib import Path
import schedule

# Quart
from quart import Quart, send_from_directory

# Dotenv
from dotenv import load_dotenv
load_dotenv()

# Controllers
from controllers.graph_controller import graph_controller_blueprint as graph_controller

# Utils
from logger.logger import build_logger
from services.session_manager import prune_sessions
#endregion

app = Quart(__name__)

app.url_map.strict_slashes = False

DEFAULT_DEBUG = False
PORT = os.getenv("PORT", 5000)

API_PREFIX = "/api"

logger = build_logger(debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

# Register controllers
app.register_blueprint(graph_controller, url_prefix = f'{API_PREFIX}/graph')

# Main page
@app.route('/')
async def index():
    return await send_from_directory((Path(__file__).resolve().parent.parent / "frontend/dist").resolve(), 'index.html')

# Static files
@app.route('/<path:path>')
async def home(path):
    return await send_from_directory((Path(__file__).resolve().parent.parent / "frontend/dist").resolve(), path)

def run(port = PORT) -> None:
    debug = os.getenv("NEURAVIZ_DEBUG", "FALSE").upper() == "TRUE"

    if debug:
        app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # This prevents caching so that changes to the frontend are reflected immediately

    # Prune sessions occasionally
    schedule.every(10).minutes.do(prune_sessions)

    app.run(debug=debug, port=port)

if __name__ == "__main__":
    run()