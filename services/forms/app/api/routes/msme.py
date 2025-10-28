from app.models.json_submission import MsmeSubmission

from .json_form_factory import build_json_form_router

router, get_service = build_json_form_router('msme', MsmeSubmission)
