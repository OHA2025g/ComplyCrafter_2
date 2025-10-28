from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..schemas import Dpt3Create, Dpt3Read
from ..services.dpt3_service import Dpt3Service, get_service

router = APIRouter(prefix='/forms/dpt3', tags=['forms'])


@router.get('', response_model=List[Dpt3Read])
async def list_submissions(service: Dpt3Service = Depends(get_service)) -> List[Dpt3Read]:
    return await service.list()


@router.post('', response_model=Dpt3Read, status_code=status.HTTP_201_CREATED)
async def create_submission(payload: Dpt3Create, service: Dpt3Service = Depends(get_service)) -> Dpt3Read:
    return await service.create(payload)


@router.get('/{submission_id}', response_model=Dpt3Read)
async def get_submission(submission_id: int, service: Dpt3Service = Depends(get_service)) -> Dpt3Read:
    submission = await service.get(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Submission not found')
    return submission
