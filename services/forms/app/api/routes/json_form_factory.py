from __future__ import annotations

from typing import Callable, List, Tuple, Type

from fastapi import APIRouter, Depends, HTTPException, status

from ...models.json_submission import JsonSubmission
from ...schemas.json_submission import JsonSubmissionCreate, JsonSubmissionRead
from ...services.json_submission_service import JsonSubmissionService, service_factory

ServiceDependency = Callable[..., JsonSubmissionService]


def build_json_form_router(form_code: str, model: Type[JsonSubmission]) -> Tuple[APIRouter, ServiceDependency]:
    """Create a FastAPI router + dependency pair for JSON-first form submissions."""

    service_dependency = service_factory(model)
    router = APIRouter(prefix=f'/forms/{form_code}', tags=['forms'])

    @router.get('', response_model=List[JsonSubmissionRead])
    async def list_submissions(
        service: JsonSubmissionService = Depends(service_dependency)
    ) -> List[JsonSubmissionRead]:
        return await service.list()

    @router.post('', response_model=JsonSubmissionRead, status_code=status.HTTP_201_CREATED)
    async def create_submission(
        payload: JsonSubmissionCreate,
        service: JsonSubmissionService = Depends(service_dependency)
    ) -> JsonSubmissionRead:
        return await service.create(payload)

    @router.get('/{submission_id}', response_model=JsonSubmissionRead)
    async def get_submission(
        submission_id: int, service: JsonSubmissionService = Depends(service_dependency)
    ) -> JsonSubmissionRead:
        submission = await service.get(submission_id)
        if not submission:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Submission not found')
        return submission

    return router, service_dependency
