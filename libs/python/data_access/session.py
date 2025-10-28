from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from .settings import get_database_url

_engine = create_async_engine(get_database_url(), echo=False, future=True)
_session_factory = async_sessionmaker(_engine, expire_on_commit=False)


async def get_async_session() -> AsyncIterator[AsyncSession]:
    async with _session_factory() as session:
        yield session
