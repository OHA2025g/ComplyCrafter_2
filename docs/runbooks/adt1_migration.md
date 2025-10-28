# ADT1 Database Migration Guide

## Apply SQL Migration (repeat per form)
1. Connect to Postgres (dev/stage) using `psql`.
2. Run the SQL file (replace filename with `002_create_ben2.sql`, `003_create_pas3.sql`, `004_create_dpt3.sql` as needed):
   ```bash
   psql "$DATABASE_URL" -f services/forms/migrations/001_create_adt1.sql
   ```
3. Verify table:
   ```sql
   \d adt1_submissions;
   ```

## Seed Sample Data
- Use `services/forms/tests/data/adt1_sample.json` with FastAPI endpoint:
  ```bash
  curl -X POST "$FORMS_URL/forms/adt1" \
    -H 'Content-Type: application/json' \
    -d @services/forms/tests/data/adt1_sample.json
  ```

## Rollback (if needed)
```sql
DROP TABLE IF EXISTS adt1_submissions;
```
