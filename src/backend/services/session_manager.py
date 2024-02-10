#region Imports
# System
import os
import datetime
from typing import List
from datetime import datetime
import schedule

# Quart
from quart import make_response
from quart.typing import ResponseTypes

# Models
from models.graph.Graph import Graph
from models.Session import Session

# Utils
from logger.logger import build_logger
from utils.db_manager import DBManager
#endregion

logger = build_logger(logger_name = "Session Manager")

db_manager = DBManager(os.getenv("MONGO_CONNECTION_STRING"), os.getenv("MONGO_DB_NAME"))

def find_or_create_session(session_id: str | None, graphs: List[Graph] = []) -> Session:
    schedule.run_pending()

    session: Session = None
    
    logger.debug("Finding or creating session.")

    if not session_id:
        logger.debug("No session id provided.")
        session = _create_session(graphs)

    if not session:
        session = db_manager.find_or_create_session(session_id, graphs)

    db_manager.use_session(session)

    return session

async def make_sessioned_response(session: Session, *args: any) -> ResponseTypes:
    res = await make_response(args)
    res.set_cookie('session_id', session.session_id)
    return res

def set_session_graph(session: Session, graph: Graph) -> bool:
    return db_manager.set_graph(session, graph)

def prune_sessions() -> int:
    return db_manager.prune_sessions()

def _create_session(graphs: List[Graph] = []) -> Session:
    session = Session(graphs=graphs)
    session.session_id = db_manager.insert_session(session)
    return session
