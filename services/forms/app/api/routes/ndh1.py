from app.models.json_submission import Ndh1Submission

from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('ndh1', Ndh1Submission)
