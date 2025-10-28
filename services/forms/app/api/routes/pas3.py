from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..schemas import Pas3Create, Pas3Read
from ..services.pas3_service import Pas3Service, get_service

router = APIRouter(prefix='/forms/pas3', tags=['forms'])


@router.get('', response_model=List[Pas3Read])
async def list_submissions(service: Pas3Service = Depends(get_service)) -> List[Pas3Read]:
    return await service.list()


@router.post('', response_model=Pas3Read, status_code=status.HTTP_201_CREATED)
async def create_submission(payload: Pas3Create, service: Pas3Service = Depends(get_service)) -> Pas3Read:
    return await service.create(payload)


@router.get('/{submission_id}', response_model=Pas3Read)
async def get_submission(submission_id: int, service: Pas3Service = Depends(get_service)) -> Pas3Read:
    submission = await service.get(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Submission not found')
    return submission
