#region Imports
from json import load
import pytest

from src.api import app

from quart.datastructures import FileStorage

# Models
from src.models.graph.Graph import Graph
#endregion

class TestGraph:
    @pytest.mark.asyncio
    async def test_get_graph_nominal(self) -> None:
        test_client = app.test_client()
        file_name = "STE_Iris.pth"
        files = {
            'files[]': FileStorage(stream=open(f"src/backend/tests/file_inputs/{file_name}", 'rb'), filename=file_name)
        }
        response = await test_client.post('/api/graph/', files=files, headers={'Content-Type': 'multipart/form-data'})
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph/nominal.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data
