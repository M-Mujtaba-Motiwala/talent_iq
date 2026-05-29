"""
TalentIQ — Resume Router
Handles PDF/DOCX parsing and skill extraction
"""

import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from models import ParsedResume
from services.resume_parser import parse_resume

router = APIRouter()


@router.post("/parse", response_model=ParsedResume)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Upload a PDF or DOCX resume. Returns structured data:
    name, email, phone, skills, experience, education.
    """
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(400, "Only PDF and DOCX files are supported.")

    content = await file.read()
    try:
        result = await parse_resume(content, file.filename)
        return result
    except Exception as e:
        raise HTTPException(500, f"Failed to parse resume: {str(e)}")


@router.post("/generate-cover-letter")
async def generate_cover_letter(job_title: str, company: str, jd: str, resume_text: str):
    """
    Generate a tailored cover letter using Claude API.
    """
    from services.ai_service import generate_cover_letter as gen
    letter = await gen(job_title, company, jd, resume_text)
    return {"cover_letter": letter}
