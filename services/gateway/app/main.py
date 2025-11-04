from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings

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


@app.get("/healthz", tags=["health"])
async def healthz() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
    }


@app.get("/", tags=["meta"], summary="Gateway welcome")
async def root() -> dict:
    return {
        "message": "Gateway service is running.",
        "docs": "/docs",
    }
