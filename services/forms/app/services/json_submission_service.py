from __future__ import annotations

from typing import Generic, List, Optional, Type, TypeVar

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from libs.python.data_access import get_async_session

from app.models.json_submission import JsonSubmission
from app.schemas.json_submission import JsonSubmissionCreate, JsonSubmissionRead

ModelT = TypeVar('ModelT', bound=JsonSubmission)


class JsonSubmissionService(Generic[ModelT]):
    def __init__(self, session: AsyncSession, model: Type[ModelT]) -> None:
        self.session = session
        self.model = model

    async def list(self) -> List[JsonSubmissionRead]:
        result = await self.session.execute(select(self.model))
        return [JsonSubmissionRead.model_validate(record) for record in result.scalars().all()]

    async def get(self, submission_id: int) -> Optional[JsonSubmissionRead]:
        entity = await self.session.get(self.model, submission_id)
        return JsonSubmissionRead.model_validate(entity) if entity else None

    async def create(self, payload: JsonSubmissionCreate) -> JsonSubmissionRead:
        entity = self.model(**payload.model_dump())
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return JsonSubmissionRead.model_validate(entity)


def service_factory(model: Type[ModelT]):
    def _get_service(session: AsyncSession = Depends(get_async_session)) -> JsonSubmissionService[ModelT]:
        return JsonSubmissionService(session, model)

    return _get_service
