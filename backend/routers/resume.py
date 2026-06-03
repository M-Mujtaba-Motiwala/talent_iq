from fastapi import APIRouter, UploadFile, File, HTTPException
from models import ParsedResume, CoverLetterRequest, CoverLetterResponse
from services.resume_parser import parse_resume

router = APIRouter()

@router.post("/parse", response_model=ParsedResume)
async def parse(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf",".docx")):
        raise HTTPException(400, "Only PDF and DOCX supported")
    content = await file.read()
    try:
        return await parse_resume(content, file.filename)
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def cover_letter(req: CoverLetterRequest):
    from services.ai_service import generate_cover_letter
    return CoverLetterResponse(cover_letter=await generate_cover_letter(req.job_title, req.company, req.jd, req.resume_text))
