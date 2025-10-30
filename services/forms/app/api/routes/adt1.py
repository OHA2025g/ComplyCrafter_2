from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ...schemas.adt1 import Adt1Create, Adt1Read
from ...services.adt1_service import Adt1Service, get_service


router = APIRouter(prefix="/forms/adt1", tags=["forms"])


@router.get("", response_model=List[Adt1Read])
async def list_submissions(service: Adt1Service = Depends(get_service)) -> List[Adt1Read]:
    return await service.list()


@router.post("", response_model=Adt1Read, status_code=status.HTTP_201_CREATED)
async def create_submission(payload: Adt1Create, service: Adt1Service = Depends(get_service)) -> Adt1Read:
    return await service.create(payload)


@router.get("/{submission_id}", response_model=Adt1Read)
async def get_submission(submission_id: int, service: Adt1Service = Depends(get_service)) -> Adt1Read:
    submission = await service.get(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ADT1 submission not found")
    return submission
