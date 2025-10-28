# ADT1 Dual-Run Procedure

## Prerequisites
- Legacy .NET API running locally (or accessible endpoint).
- FastAPI forms service running (`uvicorn app.main:app --port 8100`).
- Seed payload file (e.g., `services/forms/tests/data/adt1_sample.json`).

## Steps (repeat per form)
1. Export base URLs:
   ```bash
   LEGACY_URL=http://localhost:5000/api
   MODERN_URL=http://localhost:8100
   ```
2. Run the migration CLI dual-run command (replace `ADT1` with `BEN2`, `PAS3`, or `DPT3` and point to the appropriate sample payload in `services/forms/tests/data`):
   ```bash
   poetry run migration-cli dualrun ADT1 \
     services/forms/tests/data/adt1_sample.json \
     "$LEGACY_URL" "$MODERN_URL"
   ```
3. Review output: status codes + payloads. Matching responses indicate parity.
4. Save results to `docs/forms/adt1-dualrun-results.md` for audit.
