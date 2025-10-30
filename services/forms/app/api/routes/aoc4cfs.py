from ...models.json_submission import Aoc4cfsSubmission
from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('aoc4cfs', Aoc4cfsSubmission)
