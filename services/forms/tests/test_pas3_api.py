import json
from pathlib import Path

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.main import app
from app.services.pas3_service import Pas3Service, get_service
from libs.python.data_access import Base

DATABASE_URL = 'sqlite+aiosqlite:///:memory:'
engine = create_async_engine(DATABASE_URL, future=True, poolclass=StaticPool, echo=False)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def override_service():
    async with TestingSessionLocal() as session:  # type: AsyncSession
        yield Pas3Service(session)


@pytest.fixture(autouse=True, scope='module')
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    app.dependency_overrides[get_service] = override_service
    yield
    app.dependency_overrides.pop(get_service, None)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
async def test_create_and_list_pas3():
    payload = json.loads((Path(__file__).parent / 'data' / 'pas3_sample.json').read_text())
    async with AsyncClient(app=app, base_url='http://test') as client:
        resp = await client.post('/forms/pas3', json=payload)
        assert resp.status_code == 201, resp.text
        list_resp = await client.get('/forms/pas3')
        assert list_resp.status_code == 200
