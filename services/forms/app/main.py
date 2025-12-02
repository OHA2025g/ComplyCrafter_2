import importlib
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    adt1,
    ben2,
    pas3,
    dpt3,
    aoc4,
    aoc4cfs,
    mgt7a,
    msme,
    msme1,
    ndh1,
    ndh2,
)
from app.api.routes import auth as auth_routes
from app.api.routes import mca, dashboard, agendas, shareholder_management, capital, meetings, companies
from app.api.routes import directors, shareholders, share_certificates, debenture_holders
from app.api.routes import subscription
from app.core import get_settings, setup_logging
import os
# Setup logging
setup_logging()

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")

# Configure CORS to allow frontend requests
# Get CORS origins from settings (environment variable or defaults)
cors_origins_list = settings.cors_origins.split(",") if isinstance(settings.cors_origins, str) else settings.cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(adt1.router)
app.include_router(ben2.router)
app.include_router(pas3.router)
app.include_router(dpt3.router)
app.include_router(aoc4.router)
app.include_router(aoc4cfs.router)
app.include_router(mgt7a.router)
app.include_router(msme.router)
app.include_router(msme1.router)
app.include_router(ndh1.router)
app.include_router(ndh2.router)

# Auth routes (signup, login, etc.)
app.include_router(auth_routes.router)

# Subscription routes
app.include_router(subscription.router)

# MCA company search routes
app.include_router(mca.router)
# Note: companies_router moved to separate companies.py module for better organization

# Dashboard routes
app.include_router(dashboard.router)

# Masters routes
app.include_router(companies.router)
app.include_router(directors.router)
app.include_router(shareholders.router)
app.include_router(share_certificates.router)
app.include_router(debenture_holders.router)
app.include_router(agendas.router)
app.include_router(shareholder_management.router)
app.include_router(capital.router)

# Meeting routes
app.include_router(meetings.board_router)
app.include_router(meetings.agm_router)
app.include_router(meetings.egm_router)
app.include_router(meetings.committee_router)

# Try to dynamically register all remaining routers; skip modules that fail to import
_optional_routes = [
    "boardreport","charge","chg1","chg4","chg6","chg8","chg9",
    "dir3","dir5","dir6","dir9","dir11","dir12","dpt4",
    "form3","form4","form5","form11","form12","form15","form22","form23","form24","form28",
    "gnl1","gnl2","gnl3","iepf2","iepf5",
    "inc4","inc12","inc20a","inc22","inc23","inc24","inc28",
    "mgt6","mgt8","mgt9","mgt14","mr1","msc3",
    "pas2","pas6","run","runllp","sh7","sh8","sh9","sh11","stk2",
]

logger = logging.getLogger(__name__)
for route_name in _optional_routes:
    try:
        mod = importlib.import_module(f"app.api.routes.{route_name}")
        router = getattr(mod, "router", None)
        if router is not None:
            # Add /forms/ prefix if the router doesn't already have it
            if hasattr(router, 'prefix') and not router.prefix.startswith('/forms/'):
                app.include_router(router, prefix="/forms")
            else:
                app.include_router(router)
            logger.info(f"✓ Registered route: {route_name}")
        else:
            logger.warning("Route module '%s' has no 'router' attribute", route_name)
    except Exception as exc:
        logger.warning("Skipping route '%s' due to import error: %s", route_name, exc)


@app.get("/healthz", tags=["health"])
async def healthz() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
    }
