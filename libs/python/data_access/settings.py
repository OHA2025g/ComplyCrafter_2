import os


def get_database_url() -> str:
    return os.getenv('DATABASE_URL', 'postgresql+asyncpg://comply:comply@db:5432/comply')
