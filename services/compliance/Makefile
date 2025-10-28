.PHONY: install run lint format test

install:
	poetry install --sync

run:
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

lint:
	poetry run ruff check .

format:
	poetry run black .

test:
	poetry run pytest
