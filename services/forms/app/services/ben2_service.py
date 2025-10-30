from __future__ import annotations

from typing import List, Optional

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from libs.python.data_access import get_async_session

from app.models import BEN2
from app.schemas import Ben2Create, Ben2Read


class Ben2Service:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(self) -> List[Ben2Read]:
        result = await self.session.execute(select(BEN2))
        return [Ben2Read.model_validate(obj) for obj in result.scalars().all()]

    async def get(self, submission_id: int) -> Optional[Ben2Read]:
        entity = await self.session.get(BEN2, submission_id)
        return Ben2Read.model_validate(entity) if entity else None

    async def create(self, payload: Ben2Create) -> Ben2Read:
        entity = BEN2(**payload.model_dump())
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return Ben2Read.model_validate(entity)


def get_service(session: AsyncSession = Depends(get_async_session)) -> Ben2Service:
    return Ben2Service(session)
