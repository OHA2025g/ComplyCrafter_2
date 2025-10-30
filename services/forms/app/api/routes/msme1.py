from ...models.json_submission import Msme1Submission
from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('msme1', Msme1Submission)
