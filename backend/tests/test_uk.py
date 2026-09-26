from httpx import AsyncClient


async def test_uk_dashboard_uk_access(client: AsyncClient, uk_headers: dict):
    response = await client.get("/api/v1/uk/dashboard", headers=uk_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_houses"] == 6
    assert "tickets_by_status" in data
    assert "active" in data["tickets_by_status"]


async def test_uk_dashboard_resident_forbidden(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/uk/dashboard", headers=resident_headers)
    assert response.status_code == 403


async def test_uk_houses_returns_all(client: AsyncClient, uk_headers: dict):
    response = await client.get("/api/v1/uk/houses", headers=uk_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 6


async def test_uk_tickets_all_houses(client: AsyncClient, uk_headers: dict):
    response = await client.get("/api/v1/uk/tickets", headers=uk_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


async def test_uk_ticket_status_update(client: AsyncClient, uk_headers: dict):
    tickets_res = await client.get("/api/v1/uk/tickets", headers=uk_headers)
    ticket_id = tickets_res.json()["items"][0]["id"]

    payload = {"status": "completed", "comment": "Работы завершены"}
    patch_res = await client.patch(f"/api/v1/uk/tickets/{ticket_id}/status", json=payload, headers=uk_headers)
    assert patch_res.status_code == 200

    detail_res = await client.get(f"/api/v1/uk/tickets/{ticket_id}", headers=uk_headers)
    assert detail_res.json()["status"] == "completed"


async def test_uk_residents_filter_by_role(client: AsyncClient, uk_headers: dict):
    response = await client.get("/api/v1/uk/residents?role=resident", headers=uk_headers)
    assert response.status_code == 200
    data = response.json()
    assert all(r["role"] == "resident" for r in data["items"])


async def test_uk_update_resident_role(client: AsyncClient, uk_headers: dict):
    residents_res = await client.get("/api/v1/uk/residents?role=resident", headers=uk_headers)
    user_id = residents_res.json()["items"][0]["id"]

    payload = {"role": "chairman", "house_id": 1, "apartment_id": 1}
    patch_res = await client.patch(f"/api/v1/uk/residents/{user_id}", json=payload, headers=uk_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["role"] == "chairman"

    journal_res = await client.get("/api/v1/uk/journal", headers=uk_headers)
    assert journal_res.status_code == 200
    assert any(ev["action"] == "role_change" for ev in journal_res.json()["items"])