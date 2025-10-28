import json
from copy import deepcopy
from pathlib import Path

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.api.routes import aoc4, aoc4cfs, mgt7a, msme, msme1, ndh1, ndh2
from app.models.json_submission import (
    Aoc4Submission,
    Aoc4cfsSubmission,
    Mgt7aSubmission,
    Msme1Submission,
    MsmeSubmission,
    Ndh1Submission,
    Ndh2Submission,
)
from app.services.json_submission_service import JsonSubmissionService
from app.main import app
from libs.python.data_access import Base

DATABASE_URL = 'sqlite+aiosqlite:///:memory:'
engine = create_async_engine(DATABASE_URL, future=True, poolclass=StaticPool, echo=False)
TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

FORM_DEPENDENCIES = [
    ('/forms/aoc4', aoc4.get_service, Aoc4Submission),
    ('/forms/aoc4cfs', aoc4cfs.get_service, Aoc4cfsSubmission),
    ('/forms/mgt7a', mgt7a.get_service, Mgt7aSubmission),
    ('/forms/msme', msme.get_service, MsmeSubmission),
    ('/forms/msme1', msme1.get_service, Msme1Submission),
    ('/forms/ndh1', ndh1.get_service, Ndh1Submission),
    ('/forms/ndh2', ndh2.get_service, Ndh2Submission),
]


def override_factory(model):
    async def _override():
        async with TestingSessionLocal() as session:  # type: AsyncSession
            yield JsonSubmissionService(session, model)

    return _override


@pytest.fixture(autouse=True, scope='module')
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    for _, dependency, model in FORM_DEPENDENCIES:
        app.dependency_overrides[dependency] = override_factory(model)
    yield
    for _, dependency, _ in FORM_DEPENDENCIES:
        app.dependency_overrides.pop(dependency, None)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.mark.asyncio
@pytest.mark.parametrize('path', [entry[0] for entry in FORM_DEPENDENCIES])
async def test_phase3_forms_create_and_list(path):
    payload = json.loads((Path(__file__).parent / 'data' / 'phase3_generic_sample.json').read_text())
    payload = deepcopy(payload)
    payload['submission_data']['form'] = path

    async with AsyncClient(app=app, base_url='http://test') as client:
        resp = await client.post(path, json=payload)
        assert resp.status_code == 201, resp.text
        list_resp = await client.get(path)
        assert list_resp.status_code == 200, list_resp.text
        assert any(item['submission_data']['form'] == path for item in list_resp.json())
