"""
Share Certificates API Routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete, Table, MetaData, Column, Integer, String, Date, Numeric
from typing import List, Dict, Any
import logging

from app.api.dependencies import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/share-certificates", tags=["Share Certificates"])

metadata = MetaData()
share_certificates_table = Table(
    'share_certificates',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('company_id', Integer),
    Column('company_cin', String(21)),
    Column('certificate_no', String(100)),
    Column('certificate_type', String(50)),
    Column('folio_no', String(100)),
    Column('shareholder_name', String(500)),
    Column('distinctive_no_from', String(50)),
    Column('distinctive_no_to', String(50)),
    Column('shares', Integer),
    Column('face_value', Numeric(15, 2)),
    Column('issue_date', Date),
    Column('status', String(50)),
)


@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_certificates(
    company_id: int = None,
    company_cin: str = None,
    certificate_type: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all share certificates"""
    try:
        stmt = select(share_certificates_table)
        
        if company_id:
            stmt = stmt.where(share_certificates_table.c.company_id == company_id)
        if company_cin:
            stmt = stmt.where(share_certificates_table.c.company_cin == company_cin)
        if certificate_type:
            stmt = stmt.where(share_certificates_table.c.certificate_type == certificate_type)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        certificates = []
        for row in rows:
            certificates.append({
                'srNo': row.id,
                'certificateNo': row.certificate_no,
                'certificateType': row.certificate_type,
                'folioNo': row.folio_no,
                'shareholderName': row.shareholder_name,
                'distinctiveNoFrom': row.distinctive_no_from,
                'distinctiveNoTo': row.distinctive_no_to,
                'shares': row.shares,
                'faceValue': float(row.face_value) if row.face_value else 0,
                'issueDate': str(row.issue_date) if row.issue_date else None,
                'status': row.status,
                'companyCin': row.company_cin
            })
        
        return certificates
        
    except Exception as e:
        logger.error(f"Error fetching certificates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_certificate(data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Create new share certificate"""
    try:
        stmt = insert(share_certificates_table).values(
            company_id=data.get('company_id'),
            company_cin=data.get('company_cin'),
            certificate_no=data.get('certificate_no'),
            certificate_type=data.get('certificate_type'),
            folio_no=data.get('folio_no'),
            shareholder_name=data.get('shareholder_name'),
            distinctive_no_from=data.get('distinctive_no_from'),
            distinctive_no_to=data.get('distinctive_no_to'),
            shares=data.get('shares'),
            face_value=data.get('face_value'),
            issue_date=data.get('issue_date'),
            status=data.get('status', 'Active')
        )
        
        await db.execute(stmt)
        await db.commit()
        
        return {"message": "Share certificate created successfully"}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{certificate_id}")
async def delete_certificate(certificate_id: int, db: AsyncSession = Depends(get_db)):
    """Delete share certificate"""
    try:
        stmt = delete(share_certificates_table).where(share_certificates_table.c.id == certificate_id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Share certificate deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

