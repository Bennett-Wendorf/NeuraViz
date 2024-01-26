#region Imports
from json import load
import pytest

import sys
print(f"Path: {sys.path}")

from api import app

from quart.datastructures import FileStorage

# Models
from models.graph.Graph import Graph
#endregion

class TestGraph:
    @pytest.mark.asyncio
    async def test_get_graph_nominal_pytorch_iris(self) -> None:
        test_client = app.test_client()
        file_name = "STE_Iris.pth"
        files = {
            'files[]': FileStorage(stream=open(f"testing/input_files/pytorch/{file_name}", 'rb'), filename=file_name)
        }
        response = await test_client.post('/api/graph/', files=files, headers={'Content-Type': 'multipart/form-data'})
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph/pytorch/nominal_STE_Iris.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data

    @pytest.mark.asyncio
    async def test_get_graph_nominal_pytorch_MNIST(self) -> None:
        test_client = app.test_client()
        file_name = "STE_MNIST.pth"
        files = {
            'files[]': FileStorage(stream=open(f"testing/input_files/pytorch/{file_name}", 'rb'), filename=file_name)
        }
        response = await test_client.post('/api/graph/', files=files, headers={'Content-Type': 'multipart/form-data'})
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph/pytorch/nominal_STE_MNIST.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data

    @pytest.mark.asyncio
    async def test_get_graph_nominal_keras_iris(self) -> None:
        test_client = app.test_client()
        file_name = "STE_Iris.keras"
        files = {
            'files[]': FileStorage(stream=open(f"testing/input_files/keras/{file_name}", 'rb'), filename=file_name)
        }
        response = await test_client.post('/api/graph/', files=files, headers={'Content-Type': 'multipart/form-data'})
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph//keras/nominal_STE_Iris.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data

    @pytest.mark.asyncio
    async def test_get_graph_nominal_keras_MNIST(self) -> None:
        test_client = app.test_client()
        file_name = "STE_MNIST.keras"
        files = {
            'files[]': FileStorage(stream=open(f"testing/input_files/keras/{file_name}", 'rb'), filename=file_name)
        }
        response = await test_client.post('/api/graph/', files=files, headers={'Content-Type': 'multipart/form-data'})
        assert response.status_code == 200
        data = await response.get_json()
        with open("src/backend/tests/expected_results/get_graph/keras/nominal_STE_MNIST.json", 'r') as file:
            expected_data = load(file)
            assert data == expected_data
