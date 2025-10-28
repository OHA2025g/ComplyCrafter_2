# Phase 2 DB Migration & Tests

## SQL
- BEN2: `services/forms/migrations/002_create_ben2.sql`
- PAS3: `services/forms/migrations/003_create_pas3.sql`
- DPT3: `services/forms/migrations/004_create_dpt3.sql`

Apply each via `psql "$DATABASE_URL" -f <file>`.

## Sample Data / API Tests
Run pytest per service (requires `poetry install` first):
```
cd services/forms
poetry install --sync
poetry run pytest services/forms/tests/test_ben2_api.py
poetry run pytest services/forms/tests/test_pas3_api.py
poetry run pytest services/forms/tests/test_dpt3_api.py
```

To seed sample data into FastAPI (ensure service is running):
```
curl -X POST "$FORMS_URL/forms/ben2" -H 'Content-Type: application/json' -d @services/forms/tests/data/ben2_sample.json
```
(repeat for pas3/dpt3).
