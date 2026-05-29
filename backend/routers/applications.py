"""
TalentIQ — Applications Router
Tracks application status and triggers auto-apply
"""

from fastapi import APIRouter, HTTPException
from typing import List
from models import Application, ApplicationStatus, CoverLetterRequest, CoverLetterResponse
from services.application_engine import (
    get_all_applications,
    create_application,
    update_application_status,
    auto_apply,
)

router = APIRouter()


@router.get("/", response_model=List[Application])
async def list_applications():
    """Get all tracked job applications."""
    return await get_all_applications()


@router.post("/", response_model=Application)
async def add_application(job_id: str, cover_letter: str = ""):
    """Manually add a job application to tracker."""
    return await create_application(job_id, cover_letter)


@router.patch("/{app_id}/status")
async def update_status(app_id: str, status: ApplicationStatus):
    """Update the status of an application (Screening, Interview, etc.)."""
    return await update_application_status(app_id, status)


@router.post("/auto-apply/{job_id}")
async def trigger_auto_apply(job_id: str, resume_text: str, cover_letter: str):
    """
    Auto-fill and submit the job application form.
    Uses Playwright to navigate the application form and fill fields.
    """
    result = await auto_apply(job_id, resume_text, cover_letter)
    if not result["success"]:
        raise HTTPException(500, result.get("error", "Auto-apply failed"))
    return result


@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(req: CoverLetterRequest):
    """Generate a tailored cover letter using Claude API."""
    from services.ai_service import generate_cover_letter as gen
    letter = await gen(req.job_title, req.company, req.jd, req.resume_text)
    return CoverLetterResponse(cover_letter=letter)
