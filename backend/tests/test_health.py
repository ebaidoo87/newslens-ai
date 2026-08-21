def test_liveness_endpoint(client):
    response = client.get(
        "/api/health/live"
    )

    assert response.status_code == 200

    data = response.json()

    assert data is not None


def test_readiness_endpoint(client):
    response = client.get(
        "/api/health/ready"
    )

    assert response.status_code == 200

    data = response.json()

    assert data is not None