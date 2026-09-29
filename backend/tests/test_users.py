from httpx import AsyncClient


async def test_get_my_profile(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/users/me", headers=resident_headers)
    assert response.status_code == 200
    data = response.json()
    assert "full_name" in data
    assert "role" in data
    assert data["role"] == "resident"
    assert "personal_account" in data
    assert "is_debt_free" in data


async def test_update_my_profile(client: AsyncClient, resident_headers: dict):
    update_payload = {
        "full_name": "Иванов Иван Иванович",
        "phone": "+79991234567",
        "email": "ivanov@example.com",
        "notifications_enabled": False,
    }
    response = await client.patch("/api/v1/users/me", json=update_payload, headers=resident_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Иванов Иван Иванович"
    assert data["phone"] == "+79991234567"
    assert data["email"] == "ivanov@example.com"
    assert data["notifications_enabled"] is False


async def test_pay_utility(client: AsyncClient, resident_headers: dict):
    pay_res = await client.post("/api/v1/users/me/pay-utility", headers=resident_headers)
    assert pay_res.status_code == 200
    data = pay_res.json()
    assert data["debt_amount"] == 0.0
    assert data["is_debt_free"] is True


async def test_get_my_house(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/houses/my", headers=resident_headers)
    assert response.status_code == 200
    data = response.json()
    assert "address" in data
    assert "city" in data
    assert "providers" in data
    assert isinstance(data["providers"], list)
