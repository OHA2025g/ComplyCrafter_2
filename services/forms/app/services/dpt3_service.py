from __future__ import annotations

from typing import List, Optional

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from libs.python.data_access import get_async_session

from ..models import DPT3
from ..schemas import Dpt3Create, Dpt3Read


class Dpt3Service:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(self) -> List[Dpt3Read]:
        result = await self.session.execute(select(DPT3))
        return [Dpt3Read.model_validate(obj) for obj in result.scalars().all()]

    async def get(self, submission_id: int) -> Optional[Dpt3Read]:
        entity = await self.session.get(DPT3, submission_id)
        return Dpt3Read.model_validate(entity) if entity else None

    async def create(self, payload: Dpt3Create) -> Dpt3Read:
        entity = DPT3(**payload.model_dump())
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return Dpt3Read.model_validate(entity)


def get_service(session: AsyncSession = Depends(get_async_session)) -> Dpt3Service:
    return Dpt3Service(session)
