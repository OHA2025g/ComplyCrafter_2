# Migration CLI

Placeholder for the automation tool described in the blueprint.

## Current Commands
- `summary` – print high-level stats from the mapping/inventory.
- `form <code>` – display linkage details for a specific form.
- `generate <code>` – emit TypeScript/Pydantic scaffolds derived from the inventory (used for ADT1).
- `dualrun <code> payload legacy modern` – send a JSON payload to both legacy and modern endpoints and display the diff.

Future work: add `sync legacy` to auto-refresh inventories and integrate with dual-run dashboards.
