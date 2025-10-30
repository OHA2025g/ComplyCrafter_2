from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ...schemas import Ben2Create, Ben2Read
from ...services.ben2_service import Ben2Service, get_service

router = APIRouter(prefix='/forms/ben2', tags=['forms'])


@router.get('', response_model=List[Ben2Read])
async def list_submissions(service: Ben2Service = Depends(get_service)) -> List[Ben2Read]:
    return await service.list()


@router.post('', response_model=Ben2Read, status_code=status.HTTP_201_CREATED)
async def create_submission(payload: Ben2Create, service: Ben2Service = Depends(get_service)) -> Ben2Read:
    return await service.create(payload)


@router.get('/{submission_id}', response_model=Ben2Read)
async def get_submission(submission_id: int, service: Ben2Service = Depends(get_service)) -> Ben2Read:
    submission = await service.get(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Submission not found')
    return submission
