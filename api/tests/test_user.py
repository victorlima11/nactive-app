from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users/", json={
        "name":"Victor",
        "email":"victor@teste.com",
    })
    assert response.status_code == 200
    assert response.json()["name"] == "Victor"
    assert response.json()["email"] == "victor@teste.com"