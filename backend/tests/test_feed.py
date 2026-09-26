from httpx import AsyncClient


async def test_get_feed_by_house(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/feed", headers=resident_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["author"]["name"] == "Елена Смирнова"


async def test_create_post_chairman(client: AsyncClient, chairman_headers: dict):
    payload = {
        "title": "Собрание совета",
        "content": "В субботу в 18:00 во дворе.",
        "post_type": "announcement",
    }
    response = await client.post("/api/v1/feed", json=payload, headers=chairman_headers)
    assert response.status_code == 201

    feed_res = await client.get("/api/v1/feed", headers=chairman_headers)
    assert len(feed_res.json()) == 2


async def test_create_post_resident_forbidden(client: AsyncClient, resident_headers: dict):
    payload = {
        "title": "Самовольный пост",
        "content": "Текст жителя.",
    }
    response = await client.post("/api/v1/feed", json=payload, headers=resident_headers)
    assert response.status_code == 403


async def test_toggle_reaction(client: AsyncClient, resident_headers: dict):
    feed_res = await client.get("/api/v1/feed", headers=resident_headers)
    post_id = feed_res.json()[0]["id"]

    res1 = await client.post(f"/api/v1/feed/{post_id}/reactions", json={"reaction_type": "like"}, headers=resident_headers)
    assert res1.status_code == 200
    assert res1.json()["my_reaction"] == "like"
    assert res1.json()["likes"] == 1

    res2 = await client.post(f"/api/v1/feed/{post_id}/reactions", json={"reaction_type": "like"}, headers=resident_headers)
    assert res2.status_code == 200
    assert res2.json()["my_reaction"] is None
    assert res2.json()["likes"] == 0


async def test_add_and_get_comment(client: AsyncClient, resident_headers: dict):
    feed_res = await client.get("/api/v1/feed", headers=resident_headers)
    post_id = feed_res.json()[0]["id"]

    add_res = await client.post(
        f"/api/v1/feed/{post_id}/comments",
        json={"content": "Поддерживаю инициативу!"},
        headers=resident_headers,
    )
    assert add_res.status_code == 200

    get_res = await client.get(f"/api/v1/feed/{post_id}/comments", headers=resident_headers)
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["total"] == 1
    assert data["items"][0]["content"] == "Поддерживаю инициативу!"