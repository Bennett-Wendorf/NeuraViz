#region Imports
from json import load
import pytest

from src.api import app

# Models
from src.models.graph.Graph import Graph
#endregion

class TestGraph:
    @pytest.mark.asyncio
    async def test_get_graph_nominal(self) -> None:
        test_client = app.test_client()
        # TODO: Update this with a request body
        response = await test_client.get('/api/graph/')
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph/nominal.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data
