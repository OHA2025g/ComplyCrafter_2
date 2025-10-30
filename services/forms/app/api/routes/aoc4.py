from ...models.json_submission import Aoc4Submission
from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('aoc4', Aoc4Submission)
