from __future__ import annotations

from typing import List, Optional

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from libs.python.data_access import get_async_session

from ..models import PAS3
from ..schemas import Pas3Create, Pas3Read


class Pas3Service:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(self) -> List[Pas3Read]:
        result = await self.session.execute(select(PAS3))
        return [Pas3Read.model_validate(obj) for obj in result.scalars().all()]

    async def get(self, submission_id: int) -> Optional[Pas3Read]:
        entity = await self.session.get(PAS3, submission_id)
        return Pas3Read.model_validate(entity) if entity else None

    async def create(self, payload: Pas3Create) -> Pas3Read:
        entity = PAS3(**payload.model_dump())
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return Pas3Read.model_validate(entity)


def get_service(session: AsyncSession = Depends(get_async_session)) -> Pas3Service:
    return Pas3Service(session)
