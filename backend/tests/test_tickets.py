from httpx import AsyncClient


async def test_create_ticket_with_topic(client: AsyncClient, resident_headers: dict):
    payload = {
        "topic_code": "2.16",
        "title": "Свищ на трубе",
        "description": "Срочно перекрыть стояк",
        "recipient_codes": ["1", "2"],
        "is_public_in_feed": True,
        "attachment_ids": [],
    }
    response = await client.post("/api/v1/tickets", json=payload, headers=resident_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["topic_code"] == "2.16"
    assert data["category"] == "Внутридомовая территория"
    assert len(data["recipients"]) == 2
    assert data["is_my"] is True


async def test_create_ticket_invalid_topic(client: AsyncClient, resident_headers: dict):
    payload = {
        "topic_code": "99.99",
        "title": "Ошибка",
        "description": "Несуществующая тема",
        "recipient_codes": ["1"],
    }
    response = await client.post("/api/v1/tickets", json=payload, headers=resident_headers)
    assert response.status_code == 400


async def test_create_ticket_invalid_recipients(client: AsyncClient, resident_headers: dict):
    payload = {
        "topic_code": "4",
        "title": "Другая тема",
        "description": "Попытка отправить в неподходящую инстанцию",
        "recipient_codes": ["8"],
    }
    response = await client.post("/api/v1/tickets", json=payload, headers=resident_headers)
    assert response.status_code == 400


async def test_get_tickets_own_house(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/tickets", headers=resident_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["code"] == "#4812"


async def test_get_tickets_my_only(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/tickets?my=true", headers=resident_headers)
    assert response.status_code == 200
    items = response.json()
    assert all(item["is_my"] is True for item in items)


async def test_get_ticket_details(client: AsyncClient, resident_headers: dict):
    tickets_res = await client.get("/api/v1/tickets", headers=resident_headers)
    ticket_id = tickets_res.json()[0]["id"]

    detail_res = await client.get(f"/api/v1/tickets/{ticket_id}", headers=resident_headers)
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["id"] == ticket_id
    assert data["code"] == "#4812"
    assert len(data["recipients"]) > 0


async def test_create_ticket_empty_recipients(client: AsyncClient, resident_headers: dict):
    payload = {
        "topic_code": "2.16",
        "title": "Ошибка без адресатов",
        "description": "Не выбраны адресаты",
        "recipient_codes": [],
    }
    response = await client.post("/api/v1/tickets", json=payload, headers=resident_headers)
    assert response.status_code == 400


async def test_get_topics_root(client: AsyncClient, resident_headers: dict):
    response = await client.get("/api/v1/topics", headers=resident_headers)
    assert response.status_code == 200
    assert len(response.json()) > 0


async def test_toggle_support(client: AsyncClient, chairman_headers: dict):
    tickets_res = await client.get("/api/v1/tickets", headers=chairman_headers)
    ticket_id = tickets_res.json()[0]["id"]

    res_1 = await client.post(f"/api/v1/tickets/{ticket_id}/support", headers=chairman_headers)
    assert res_1.status_code == 200
    assert res_1.json()["is_supported_by_me"] is True

    res_2 = await client.post(f"/api/v1/tickets/{ticket_id}/support", headers=chairman_headers)
    assert res_2.status_code == 200
    assert res_2.json()["is_supported_by_me"] is False


async def test_toggle_support_own_ticket_forbidden(client: AsyncClient, resident_headers: dict):
    tickets_res = await client.get("/api/v1/tickets", headers=resident_headers)
    ticket_id = tickets_res.json()[0]["id"]

    res = await client.post(f"/api/v1/tickets/{ticket_id}/support", headers=resident_headers)
    assert res.status_code == 400


async def test_update_ticket(client: AsyncClient, resident_headers: dict):
    tickets_res = await client.get("/api/v1/tickets", headers=resident_headers)
    ticket_id = tickets_res.json()[0]["id"]

    update_res = await client.put(
        f"/api/v1/tickets/{ticket_id}",
        json={"title": "Обновленная тема", "description": "Обновленное описание"},
        headers=resident_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Обновленная тема"


async def test_delete_ticket(client: AsyncClient, resident_headers: dict):
    payload = {
        "topic_code": "2.16",
        "title": "Заявка на удаление",
        "description": "Описание для отзыва",
        "recipient_codes": ["1"],
        "is_public_in_feed": True,
        "attachment_ids": [],
    }
    create_res = await client.post("/api/v1/tickets", json=payload, headers=resident_headers)
    ticket_id = create_res.json()["id"]

    del_res = await client.delete(f"/api/v1/tickets/{ticket_id}", headers=resident_headers)
    assert del_res.status_code == 204

    get_res = await client.get(f"/api/v1/tickets/{ticket_id}", headers=resident_headers)
    assert get_res.status_code == 404