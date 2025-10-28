from __future__ import annotations

from typing import List, Optional

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from libs.python.data_access import get_async_session

from ..models.adt1 import Adt1
from ..schemas.adt1 import Adt1Create, Adt1Read


class Adt1Service:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(self) -> List[Adt1Read]:
        result = await self.session.execute(select(Adt1))
        submissions = result.scalars().all()
        return [Adt1Read.model_validate(obj) for obj in submissions]

    async def get(self, submission_id: int) -> Optional[Adt1Read]:
        entity = await self.session.get(Adt1, submission_id)
        return Adt1Read.model_validate(entity) if entity else None

    async def create(self, payload: Adt1Create) -> Adt1Read:
        data = payload.model_dump()
        entity = Adt1(**data)
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return Adt1Read.model_validate(entity)


async def get_service(session: AsyncSession = Depends(get_async_session)) -> Adt1Service:
    return Adt1Service(session)
