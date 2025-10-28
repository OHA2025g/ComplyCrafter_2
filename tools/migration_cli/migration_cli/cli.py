from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[2]
FORM_MAP = ROOT / "Resources" / "end_to_end_mapping.json"
FIELD_MAP = ROOT / "Resources" / "field_inventory.json"


def load_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Missing resource: {path}")
    return json.loads(path.read_text())


def summarize() -> None:
    mapping = load_json(FORM_MAP)
    forms = mapping.get("forms", [])
    domains = mapping.get("domains", [])
    inventory = load_json(FIELD_MAP)
    print(f"Forms tracked: {len(forms)}")
    print(f"Domains tracked: {len(domains)}")
    print(f"Form DTO files inventoried: {len(inventory.get('forms', {}))}")


def show_form(code: str) -> None:
    mapping = load_json(FORM_MAP)
    forms: List[Dict[str, Any]] = mapping.get("forms", [])
    entry = next((f for f in forms if f["id"].lower() == code.lower()), None)
    if not entry:
        raise SystemExit(f"Form {code} not found in mapping JSON")
    print(json.dumps(entry, indent=2))


def _ts_interface(code: str, fields: List[Dict[str, str]]) -> str:
    def ts_type(dotnet: str) -> str:
        mapping = {
            "string": "string",
            "string?": "string | null",
            "int": "number",
            "int?": "number | null",
            "decimal": "number",
            "decimal?": "number | null",
            "DateTime": "string",
            "DateTime?": "string | null",
            "Boolean": "boolean",
            "Boolean?": "boolean | null",
        }
        return mapping.get(dotnet, "string | null")

    lines = [f"export interface {code.title()}FormModel {{"]
    for field in fields:
        name = field["name"][0].lower() + field["name"][1:]
        lines.append(f"  {name}: {ts_type(field['type'])};")
    lines.append("}")
    return "\n".join(lines)


def _pydantic_model(code: str, fields: List[Dict[str, str]]) -> str:
    def py_name(src: str) -> str:
        name = src[0].lower() + src[1:]
        return name.replace("DIN", "din")

    def py_type(dotnet: str) -> str:
        mapping = {
            "string": "str",
            "string?": "Optional[str]",
            "int": "int",
            "int?": "Optional[int]",
            "decimal": "float",
            "decimal?": "Optional[float]",
            "DateTime": "datetime",
            "DateTime?": "Optional[datetime]",
            "Boolean": "bool",
            "Boolean?": "Optional[bool]",
        }
        return mapping.get(dotnet, "Optional[str]")

    lines = ["from datetime import datetime", "from typing import Optional", "", "from pydantic import BaseModel", "", f"class {code.title()}Payload(BaseModel):"]
    for field in fields:
        lines.append(f"    {py_name(field['name'])}: {py_type(field['type'])} = None")
    return "\n".join(lines)




def dual_run(code: str, payload_path: Path, legacy_url: str, modern_url: str) -> None:
    import httpx

    payload = json.loads(payload_path.read_text())
    with httpx.Client() as client:
        legacy_resp = client.post(f"{legacy_url}/forms/{code.lower()}", json=payload)
        modern_resp = client.post(f"{modern_url}/forms/{code.lower()}", json=payload)
    print("Legacy status:", legacy_resp.status_code)
    print("Modern status:", modern_resp.status_code)
    if legacy_resp.text == modern_resp.text:
        print("Responses match")
    else:
        print("Legacy response:", legacy_resp.text)
        print("Modern response:", modern_resp.text)

def generate_form_assets(code: str) -> None:
    inventory = load_json(FIELD_MAP)
    form_key = None
    for key in inventory["forms"]:
        if key.lower().endswith(f"/{code.upper()}.cs".lower()):
            form_key = key
            break
    if not form_key:
        raise SystemExit(f"Field inventory entry missing for {code}")
    fields = inventory["forms"][form_key]
    print("/* TypeScript interface */")
    print(_ts_interface(code, fields))
    print("\n# Pydantic model")
    print(_pydantic_model(code, fields))


def main() -> None:
    parser = argparse.ArgumentParser(description="Migration helper CLI")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("summary", help="Print summary information from inventories")
    form_parser = sub.add_parser("form", help="Show linkage info for a specific form")
    form_parser.add_argument("code", help="Form code (e.g., ADT1)")
    generate_parser = sub.add_parser("generate", help="Print scaffold snippets for a form")
    generate_parser.add_argument("code", help="Form code (e.g., ADT1)")
    dual_parser = sub.add_parser("dualrun", help="Compare legacy vs modern endpoints")
    dual_parser.add_argument("code", help="Form code (e.g., ADT1)")
    dual_parser.add_argument("payload", help="Path to JSON payload for submission")
    dual_parser.add_argument("legacy", help="Legacy base URL")
    dual_parser.add_argument("modern", help="Modern base URL")

    args = parser.parse_args()
    if args.command == "summary":
        summarize()
    elif args.command == "form":
        show_form(args.code)
    elif args.command == "generate":
        generate_form_assets(args.code)
    elif args.command == "dualrun":
        dual_run(args.code, Path(args.payload), args.legacy, args.modern)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
