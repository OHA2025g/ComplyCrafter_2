"""
MCA (Ministry of Corporate Affairs) Company Search API
Provides cached company search functionality with live API fallback
"""
from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy import select, or_, func, insert, Table, MetaData, Column, Integer, String, DateTime, Text
from typing import List, Dict, Any
import logging
import httpx
from urllib.parse import quote
from datetime import datetime

from app.api.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

# MCA Live API Configuration
MCA_API_BASE = "http://45.142.237.183:8080/mca/search"
MCA_API_TIMEOUT = 60  # seconds (increased from 30 - MCA API can be slow)

router = APIRouter(prefix="/mca", tags=["MCA Company Search"])

# Also add a companies router for user company management
companies_router = APIRouter(prefix="/companies", tags=["User Companies"])


@router.get("/search")
async def search_companies(
    query: str = Query(..., min_length=3, description="Company name to search"),
    limit: int = Query(20, le=100, description="Maximum results to return"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Search for companies with intelligent caching
    
    Flow:
    1. Check cache database first (instant results)
    2. If no results, call live MCA API
    3. Cache the results for future use
    4. Return results
    """
    try:
        logger.info(f"🔍 Searching for companies with query: '{query}'")
        
        # Define the mca_companies_cache table structure
        metadata = MetaData()
        mca_cache = Table(
            'mca_companies_cache',
            metadata,
            Column('id', Integer, primary_key=True),
            Column('company_name', String(500)),
            Column('cin', String(21)),
            Column('company_status', String(50)),
            Column('company_class', String(100)),
            Column('registration_date', String(50)),
            Column('authorized_capital', String(100)),
            Column('paid_up_capital', String(100)),
            Column('email', String(200)),
            Column('registered_address', Text),
            Column('listing_status', String(50)),
            Column('date_of_last_agm', String(50)),
            Column('date_of_balance_sheet', String(50)),
            Column('cached_at', DateTime),
        )
        
        # STEP 1: Check cache database first
        search_pattern = f"%{query}%"
        
        stmt = select(mca_cache).where(
            or_(
                func.lower(mca_cache.c.company_name).like(func.lower(search_pattern)),
                func.lower(mca_cache.c.cin).like(func.lower(search_pattern))
            )
        ).limit(limit)
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        # If found in cache, return immediately
        if rows:
            companies = []
            for row in rows:
                companies.append({
                    'company_name': row.company_name,
                    'cin': row.cin,
                    'company_status': row.company_status,
                    'company_class': row.company_class,
                    'registration_date': row.registration_date,
                    'authorized_capital': row.authorized_capital,
                    'paid_up_capital': row.paid_up_capital,
                    'email': row.email,
                    'registered_address': row.registered_address,
                    'listing_status': row.listing_status,
                    'date_of_last_agm': row.date_of_last_agm,
                    'date_of_balance_sheet': row.date_of_balance_sheet
                })
            
            logger.info(f"✅ Cache HIT: Found {len(companies)} companies in cache")
            
            return {
                "query": query,
                "count": len(companies),
                "source": "cache",
                "results": companies
            }
        
        # STEP 2: Cache MISS - Call live MCA API
        logger.info(f"⚠️ Cache MISS: Searching live MCA API for '{query}'")
        
        try:
            mca_url = f"{MCA_API_BASE}?search_type=company&id={quote(query)}"
            logger.info(f"📡 Calling MCA API: {mca_url}")
            
            async with httpx.AsyncClient(timeout=MCA_API_TIMEOUT) as client:
                response = await client.get(mca_url)
                
                if response.status_code != 200:
                    logger.error(f"MCA API returned status {response.status_code}")
                    return {
                        "query": query,
                        "count": 0,
                        "source": "api_error",
                        "error": f"MCA API returned status {response.status_code}",
                        "results": []
                    }
                
                mca_data = response.json()
                logger.info(f"📥 MCA API Response: {mca_data.get('message', 'No message')}")
                
                # STEP 3: Parse and cache results
                results_data = mca_data.get('results', {})
                
                # Check for errors in response
                if results_data.get('error'):
                    logger.warning(f"MCA API error: {results_data.get('error')}")
                    return {
                        "query": query,
                        "count": 0,
                        "source": "mca_api",
                        "error": results_data.get('error'),
                        "results": []
                    }
                
                # Parse company data from MCA response
                data = results_data.get('data', {})
                
                if not data or isinstance(data, str):
                    logger.warning(f"No valid data in MCA API response")
                    return {
                        "query": query,
                        "count": 0,
                        "source": "mca_api",
                        "message": "No companies found",
                        "results": []
                    }
                
                # Extract companies (MCA API can return single or multiple results)
                companies_to_cache = []
                
                # Handle different response formats
                if isinstance(data, dict):
                    if 'companyData' in data:
                        # Single company result (CIN search)
                        company_data = data['companyData']
                        companies_to_cache.append(company_data)
                    elif 'result' in data:
                        # Multiple companies (company name search)
                        companies_to_cache = data['result']
                    elif 'companies' in data:
                        # Alternative format
                        companies_to_cache = data['companies']
                    else:
                        # Assume the dict itself is company data
                        companies_to_cache.append(data)
                elif isinstance(data, list):
                    companies_to_cache = data
                
                # STEP 4: Cache the results
                cached_companies = []
                for company in companies_to_cache[:limit]:  # Respect limit
                    try:
                        # Handle both MCA API field names (cmpnyNm, cnNmbr) and standard names
                        company_name = (company.get('cmpnyNm', '') or 
                                      company.get('company', '') or 
                                      company.get('companyName', ''))
                        cin = (company.get('cnNmbr', '') or 
                              company.get('cin', '') or 
                              company.get('corporateIdentityNumber', ''))
                        
                        if not cin:
                            continue
                        
                        # Map MCA API fields to standard fields
                        company_status = (company.get('cmpnySts', '') or 
                                        company.get('companyStatus', '') or 
                                        company.get('companyCategory', ''))
                        company_class = (company.get('companyType', '') or 
                                       company.get('companyClass', ''))
                        registration_date = (company.get('dateOfIncorporation', '') or 
                                           company.get('registrationDate', ''))
                        
                        # Prepare insert statement
                        insert_stmt = insert(mca_cache).values(
                            company_name=company_name,
                            cin=cin,
                            company_status=company_status,
                            company_class=company_class,
                            registration_date=registration_date,
                            authorized_capital=company.get('authorisedCapital', '') or company.get('authorizedCapital', ''),
                            paid_up_capital=company.get('paidUpCapital', ''),
                            email=company.get('emailAddress', ''),
                            registered_address=company.get('registeredAddress', ''),
                            listing_status=company.get('listingStatus', ''),
                            date_of_last_agm=company.get('dateOfLastAGM', ''),
                            date_of_balance_sheet=company.get('dateOfBalanceSheet', ''),
                            cached_at=datetime.now()
                        )
                        
                        # Use ON CONFLICT to avoid duplicates
                        from sqlalchemy.dialects.postgresql import insert as pg_insert
                        upsert_stmt = pg_insert(mca_cache).values(
                            company_name=company_name,
                            cin=cin,
                            company_status=company_status,
                            company_class=company_class,
                            registration_date=registration_date,
                            authorized_capital=company.get('authorisedCapital', '') or company.get('authorizedCapital', ''),
                            paid_up_capital=company.get('paidUpCapital', ''),
                            email=company.get('emailAddress', ''),
                            registered_address=company.get('registeredAddress', ''),
                            listing_status=company.get('listingStatus', ''),
                            date_of_last_agm=company.get('dateOfLastAGM', ''),
                            date_of_balance_sheet=company.get('dateOfBalanceSheet', ''),
                            cached_at=datetime.now()
                        ).on_conflict_do_update(
                            index_elements=['cin'],
                            set_={
                                'company_name': company_name,
                                'company_status': company_status,
                                'cached_at': datetime.now()
                            }
                        )
                        
                        await db.execute(upsert_stmt)
                        
                        cached_companies.append({
                            'company_name': company_name,
                            'cin': cin,
                            'company_status': company_status,
                            'company_class': company_class,
                            'registration_date': registration_date,
                            'authorized_capital': company.get('authorisedCapital', '') or company.get('authorizedCapital', ''),
                            'paid_up_capital': company.get('paidUpCapital', ''),
                            'email': company.get('emailAddress', ''),
                            'registered_address': company.get('registeredAddress', ''),
                            'listing_status': company.get('listingStatus', ''),
                            'date_of_last_agm': company.get('dateOfLastAGM', ''),
                            'date_of_balance_sheet': company.get('dateOfBalanceSheet', '')
                        })
                        
                    except Exception as cache_error:
                        logger.error(f"Error caching company: {cache_error}")
                        continue
                
                # Commit all cached companies
                await db.commit()
                
                logger.info(f"✅ Cached {len(cached_companies)} companies from live MCA API")
                
                return {
                    "query": query,
                    "count": len(cached_companies),
                    "source": "mca_api",
                    "cached": True,
                    "results": cached_companies
                }
                
        except httpx.TimeoutException:
            logger.error(f"MCA API timeout after {MCA_API_TIMEOUT} seconds")
            return {
                "query": query,
                "count": 0,
                "source": "api_timeout",
                "error": "MCA API request timed out",
                "results": []
            }
        except Exception as api_error:
            logger.error(f"Error calling MCA API: {str(api_error)}")
            return {
                "query": query,
                "count": 0,
                "source": "api_error",
                "error": str(api_error),
                "results": []
            }
        
    except Exception as e:
        logger.error(f"Error in search_companies: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/company/{cin}")
async def get_company_by_cin(
    cin: str,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get company details by CIN from cache
    """
    try:
        metadata = MetaData()
        mca_cache = Table(
            'mca_companies_cache',
            metadata,
            Column('id', Integer, primary_key=True),
            Column('company_name', String(500)),
            Column('cin', String(21)),
            Column('company_status', String(50)),
            Column('company_class', String(100)),
            Column('registration_date', String(50)),
            Column('authorized_capital', String(100)),
            Column('paid_up_capital', String(100)),
            Column('email', String(200)),
            Column('registered_address', Text),
            Column('listing_status', String(50)),
            Column('date_of_last_agm', String(50)),
            Column('date_of_balance_sheet', String(50)),
            Column('cached_at', DateTime),
        )
        
        stmt = select(mca_cache).where(mca_cache.c.cin == cin)
        result = await db.execute(stmt)
        row = result.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail=f"Company with CIN {cin} not found")
        
        return {
            'company_name': row.company_name,
            'cin': row.cin,
            'company_status': row.company_status,
            'company_class': row.company_class,
            'registration_date': row.registration_date,
            'authorized_capital': row.authorized_capital,
            'paid_up_capital': row.paid_up_capital,
            'email': row.email,
            'registered_address': row.registered_address,
            'listing_status': row.listing_status,
            'date_of_last_agm': row.date_of_last_agm,
            'date_of_balance_sheet': row.date_of_balance_sheet
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching company: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch company: {str(e)}")


# ==================== USER COMPANIES ENDPOINTS ====================

@companies_router.post("/")
async def add_user_company(
    company_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Add a company to user's account
    """
    try:
        from sqlalchemy import Boolean
        
        metadata = MetaData()
        user_companies = Table(
            'user_companies',
            metadata,
            Column('id', Integer, primary_key=True),
            Column('user_id', Integer),
            Column('cin', String(21)),
            Column('company_name', String(500)),
            Column('company_status', String(50)),
            Column('company_class', String(100)),
            Column('added_at', DateTime),
            Column('is_active', Boolean),
        )
        
        # For now, use user_id = 1 (will be replaced with actual auth later)
        user_id = 1
        
        stmt = insert(user_companies).values(
            user_id=user_id,
            cin=company_data.get('cin'),
            company_name=company_data.get('company_name'),
            company_status=company_data.get('company_status'),
            company_class=company_data.get('company_class'),
            is_active=True
        )
        
        # Use ON CONFLICT to handle duplicates
        from sqlalchemy.dialects.postgresql import insert as pg_insert
        stmt = pg_insert(user_companies).values(
            user_id=user_id,
            cin=company_data.get('cin'),
            company_name=company_data.get('company_name'),
            company_status=company_data.get('company_status'),
            company_class=company_data.get('company_class'),
            is_active=True
        ).on_conflict_do_nothing(index_elements=['user_id', 'cin'])
        
        result = await db.execute(stmt)
        await db.commit()
        
        logger.info(f"Added company {company_data.get('company_name')} for user {user_id}")
        
        return {
            "message": "Company added successfully",
            "cin": company_data.get('cin'),
            "company_name": company_data.get('company_name')
        }
        
    except Exception as e:
        logger.error(f"Error adding company: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add company: {str(e)}")


@companies_router.get("/")
async def get_user_companies(
    db: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get all companies for current user
    """
    try:
        from sqlalchemy import Boolean
        
        metadata = MetaData()
        user_companies = Table(
            'user_companies',
            metadata,
            Column('id', Integer, primary_key=True),
            Column('user_id', Integer),
            Column('cin', String(21)),
            Column('company_name', String(500)),
            Column('company_status', String(50)),
            Column('company_class', String(100)),
            Column('added_at', DateTime),
            Column('is_active', Boolean),
        )
        
        # For now, use user_id = 1
        user_id = 1
        
        stmt = select(user_companies).where(
            user_companies.c.user_id == user_id,
            user_companies.c.is_active == True
        )
        
        result = await db.execute(stmt)
        rows = result.fetchall()
        
        companies = []
        for row in rows:
            companies.append({
                'cin': row.cin,
                'company_name': row.company_name,
                'company_status': row.company_status,
                'company_class': row.company_class,
                'added_at': str(row.added_at) if row.added_at else None
            })
        
        return companies
        
    except Exception as e:
        logger.error(f"Error fetching user companies: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch companies: {str(e)}")

