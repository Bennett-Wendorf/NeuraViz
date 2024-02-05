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
from models.graph.Node import Node
from models.graph.Link import Link
from models.graph.Graph import Graph

# Utils
from logger.logger import build_logger
from services.session_manager import find_or_create_session, make_sessioned_response, set_session_graph
#endregion

logger = build_logger(logger_name = "Graph Controller", debug = os.getenv("DEBUG", "FALSE").upper() == "TRUE")

graph_controller_blueprint = Blueprint('graph_controller', __name__)

LAYER_MARGIN = 2
NODE_MARGIN = 1

MODEL_UPLOAD_PATH = (Path(__file__).parent.parent / "model_uploads/").resolve()

ALLOWED_EXTENSIONS = ['pth', 'keras']

@graph_controller_blueprint.post('/')
async def get_graph():
    logger.debug("Received request to get graph")

    session = find_or_create_session(request.cookies.get('session_id'))

    files = await request.files
    if files:
        file = files['files[]']

        file_extension = file.filename.split('.')[-1]
        if file_extension not in ALLOWED_EXTENSIONS:
            logger.debug("Invalid file extension")
            return await make_sessioned_response(session, 
                { "message": f"Invalid file extension. Available files types include: {_get_printable_list(ALLOWED_EXTENSIONS)}" }, 
                400)

        match file_extension:
            case 'pth':
                logger.debug("File type identified: Pytorch model")
                await file.save(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                graph = Graph.from_pytorch(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                os.remove(f"{MODEL_UPLOAD_PATH}/{file.filename}.upload")
                if graph is None:
                    logger.debug("The pytorch model was invalid")
                    return await make_sessioned_response(session, { "message": "Invalid file" }, 400)
                else:
                    set_session_graph(session, graph)
                    return await make_sessioned_response(session, {'graph': graph}, 200)
            case 'keras':
                logger.debug("File type identified: Keras model")
                await file.save(f"{MODEL_UPLOAD_PATH}/{file.filename}")
                graph = Graph.from_keras(f"{MODEL_UPLOAD_PATH}/{file.filename}")
                os.remove(f"{MODEL_UPLOAD_PATH}/{file.filename}")
                if graph is None:
                    logger.debug("The keras model was invalid")
                    return await make_sessioned_response(session, { "message": "Invalid file" }, 400)
                else:
                    set_session_graph(session, graph)
                    return await make_sessioned_response(session, {'graph': graph}, 200)
            case _:
                logger.warn("File type not identified")
                return await make_sessioned_response(session, { "message": "Not implemented" }, 501)
    else:
        logger.debug("No file selected")
        return await make_sessioned_response(session, { "message": "No file selected" }, 400)

def _get_printable_list(data: List[str]) -> str:
    return ", ".join(data)