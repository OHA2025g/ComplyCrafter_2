from ...models.json_submission import Ndh2Submission
from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('ndh2', Ndh2Submission)
