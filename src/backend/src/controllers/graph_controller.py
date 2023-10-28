#region Imports
# System
from typing import List
import os
from pathlib import Path

# Quart
import quart
from quart import Blueprint
from quart import request, abort

# Models
from src.models.graph.Node import Node
from src.models.graph.Link import Link
from src.models.graph.Graph import Graph

# Utils
from src.logger.logger import build_logger
#endregion

logger = build_logger(logger_name = "Graph Controller", debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

graph_controller_blueprint = Blueprint('graph_controller', __name__)

LAYER_MARGIN = 2
NODE_MARGIN = 1

MODEL_UPLOAD_PATH = (Path(__file__).parent.parent.parent / "model_uploads/").resolve()

ALLOWED_EXTENSIONS = ['pth']

@graph_controller_blueprint.post('/')
async def get_graph():
    logger.debug("Received request to get graph")
    files = await request.files
    if files:
        file = files['files[]']

        file_extension = file.filename.split('.')[-1]
        if file_extension not in ALLOWED_EXTENSIONS:
            logger.debug("Invalid file extension")
            return { "message": "Invalid file extension" }, 400

        match file_extension:
            case 'pth':
                logger.debug("File type identified: Pytorch model")
                await file.save(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                graph = Graph.from_pytorch(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                os.remove(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                if graph is None:
                    logger.debug("The pytorch model was invalid")
                    return { "message": "Invalid file" }, 400
                else:
                    return {'graph': graph}, 200
            case _:
                logger.warn("File type not identified")
                return { "message": "Not implemented" }, 501
    else:
        logger.debug("No file selected")
        return { "message": "No file selected" }, 400