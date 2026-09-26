import time
from httpx import AsyncClient
from tests.conftest import make_valid_init_data, TEST_BOT_TOKEN


async def test_max_login_valid(client: AsyncClient):
    init_data = make_valid_init_data(TEST_BOT_TOKEN, user_id=123456789)
    response = await client.post("/api/v1/auth/max-login", json={"initData": init_data})
    assert response.status_code == 200
    data = response.json()
    assert "tokens" in data
    assert "accessToken" in data["tokens"]
    assert "refreshToken" in data["tokens"]
    assert data["user"]["max_user_id"] == 123456789
    assert data["hasPin"] is True


async def test_max_login_invalid_hash(client: AsyncClient):
    init_data = make_valid_init_data(TEST_BOT_TOKEN, user_id=123456789)
    tampered = init_data.replace("hash=", "hash=badhash123")
    response = await client.post("/api/v1/auth/max-login", json={"initData": tampered})
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "INVALID_INIT_DATA"


async def test_max_login_expired(client: AsyncClient):
    expired_time = int(time.time()) - 7200
    init_data = make_valid_init_data(TEST_BOT_TOKEN, user_id=123456789, auth_date=expired_time)
    response = await client.post("/api/v1/auth/max-login", json={"initData": init_data})
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "INIT_DATA_EXPIRED"


async def test_max_login_empty(client: AsyncClient):
    response = await client.post("/api/v1/auth/max-login", json={"initData": ""})
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "INVALID_INIT_DATA"


async def test_esia_login_resident(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "123-456-789 01", "password": "demo_password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "resident"
    assert data["user"]["house_address"] == "ул. Баумана, д. 12"
    assert data["user"]["apartment_number"] == "48"


async def test_esia_login_chairman(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "987-654-321 00", "password": "demo_password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "chairman"


async def test_esia_login_uk(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "+78432100010", "password": "demo_password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "uk_staff"


async def test_esia_login_wrong_password(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "123-456-789 01", "password": "wrong_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "INVALID_CREDENTIALS"


async def test_esia_login_nonexistent(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "000-000-000 00", "password": "demo_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "INVALID_CREDENTIALS"


async def test_refresh_valid(client: AsyncClient):
    login_res = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "123-456-789 01", "password": "demo_password"},
    )
    refresh_token = login_res.json()["tokens"]["refreshToken"]

    refresh_res = await client.post("/api/v1/auth/refresh", json={"refreshToken": refresh_token})
    assert refresh_res.status_code == 200
    assert "accessToken" in refresh_res.json()
    assert "refreshToken" in refresh_res.json()


async def test_refresh_revoked(client: AsyncClient):
    login_res = await client.post(
        "/api/v1/auth/esia-login",
        json={"identifier": "123-456-789 01", "password": "demo_password"},
    )
    refresh_token = login_res.json()["tokens"]["refreshToken"]
    await client.post("/api/v1/auth/refresh", json={"refreshToken": refresh_token})

    second_res = await client.post("/api/v1/auth/refresh", json={"refreshToken": refresh_token})
    assert second_res.status_code == 401


async def test_pin_setup_and_verify(client: AsyncClient, resident_headers: dict):
    setup_res = await client.post("/api/v1/auth/pin/setup", json={"pin": "5678"}, headers=resident_headers)
    assert setup_res.status_code == 200

    verify_valid = await client.post("/api/v1/auth/pin/verify", json={"pin": "5678"}, headers=resident_headers)
    assert verify_valid.status_code == 200
    assert verify_valid.json()["valid"] is True

    verify_invalid = await client.post("/api/v1/auth/pin/verify", json={"pin": "0000"}, headers=resident_headers)
    assert verify_invalid.status_code == 200
    assert verify_invalid.json()["valid"] is False