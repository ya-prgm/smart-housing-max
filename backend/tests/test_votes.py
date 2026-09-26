from httpx import AsyncClient


async def test_get_polls(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/votes", headers=resident_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["title"] == "Установка шлагбаума"


async def test_get_poll_details(client: AsyncClient, resident_headers: dict):
    polls_res = await client.get("/api/v1/votes", headers=resident_headers)
    poll_id = polls_res.json()[0]["id"]

    res = await client.get(f"/api/v1/votes/{poll_id}", headers=resident_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["questions"]) == 1
    assert len(data["questions"][0]["options"]) == 2


async def test_submit_poll(client: AsyncClient, resident_headers: dict):
    polls_res = await client.get("/api/v1/votes", headers=resident_headers)
    poll_id = polls_res.json()[0]["id"]
    detail_res = await client.get(f"/api/v1/votes/{poll_id}", headers=resident_headers)
    q = detail_res.json()["questions"][0]
    opt_id = q["options"][0]["id"]

    payload = {
        "answers": [
            {"question_id": q["id"], "selected_option_id": opt_id, "text_answer": None}
        ]
    }
    response = await client.post(f"/api/v1/votes/{poll_id}/submit", json=payload, headers=resident_headers)
    assert response.status_code == 200

    poll_after = await client.get(f"/api/v1/votes/{poll_id}", headers=resident_headers)
    assert poll_after.json()["is_completed_by_me"] is True


async def test_submit_poll_twice(client: AsyncClient, resident_headers: dict):
    polls_res = await client.get("/api/v1/votes", headers=resident_headers)
    poll_id = polls_res.json()[0]["id"]
    detail_res = await client.get(f"/api/v1/votes/{poll_id}", headers=resident_headers)
    q = detail_res.json()["questions"][0]
    opt_id = q["options"][0]["id"]

    payload = {
        "answers": [
            {"question_id": q["id"], "selected_option_id": opt_id, "text_answer": None}
        ]
    }
    res1 = await client.post(f"/api/v1/votes/{poll_id}/submit", json=payload, headers=resident_headers)
    assert res1.status_code == 200

    res2 = await client.post(f"/api/v1/votes/{poll_id}/submit", json=payload, headers=resident_headers)
    assert res2.status_code in (400, 500)