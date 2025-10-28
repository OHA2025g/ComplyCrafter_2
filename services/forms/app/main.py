from fastapi import FastAPI

from app.api.routes import adt1, ben2, pas3, dpt3, aoc4, aoc4cfs, mgt7a, msme, msme1, ndh1, ndh2
from app.config import get_settings

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")
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


@app.get("/healthz", tags=["health"])
async def healthz() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
    }
