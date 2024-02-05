from pymongo import MongoClient
from models.Session import Session
from models.graph.Graph import Graph
from typing import List
from datetime import datetime, timedelta
from bson import ObjectId

class DBManager:
    def __init__(self, connection_string: str, db_name: str = "neuraviz"):
        self.db_server = MongoClient(f"{connection_string}/{db_name}?directConnection=true&appName=neuraviz")
        self.db = self.db_server[db_name]
        self.sessions = self.db["sessions"]

    def insert_session(self, session: Session) -> str | None:
        res = self.sessions.insert_one(session.to_dict())
        return str(res.inserted_id) if res.acknowledged else None

    def use_session(self, session: Session) -> bool:
        session.last_used = datetime.now()
        res = self.sessions.update_one({ "_id": ObjectId(session.session_id) }, { "$set": { "last_used": session.last_used } })
        return res.acknowledged and res.modified_count > 0

    def set_graph(self, session: Session, new_graph: Graph) -> bool:
        session.graphs = [new_graph]
        graphs = [graph.to_dict() for graph in session.graphs]
        res = self.sessions.update_one({"_id": ObjectId(session.session_id)}, {"$set": { "graphs": graphs }})
        return res.acknowledged and res.modified_count > 0

    def prune_sessions(self) -> int:
        res = self.sessions.delete_many({"last_used": {"$lt": datetime.now() - timedelta(days=1)}})
        return res.deleted_count

    def find_or_create_session(self, session_id: str, graphs: List[Graph] = []) -> Session:
        session = Session.from_dict(self.sessions.find_one({"_id": ObjectId(session_id)}))
        if session is None:
            session = Session(graphs=graphs, last_used=datetime.now())
            session.session_id = self.insert_session(session)
        return session