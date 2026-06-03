from fastapi import APIRouter, HTTPException
from typing import List
from models import Application, ApplicationStatus
from services.application_engine import get_all_applications, create_application, update_status
from pydantic import BaseModel

router = APIRouter()

class CreateAppRequest(BaseModel):
    job_id: str
    job_title: str
    company: str
    logo: str
    logo_color: str
    cover_letter: str = ""

@router.get("/", response_model=List[Application])
async def list_apps():
    return await get_all_applications()

@router.post("/", response_model=Application)
async def add_app(req: CreateAppRequest):
    return await create_application(req.job_id, req.job_title, req.company, req.logo, req.logo_color, req.cover_letter)

@router.patch("/{app_id}/status")
async def set_status(app_id: str, status: ApplicationStatus):
    try:
        return await update_status(app_id, status)
    except ValueError as e:
        raise HTTPException(404, str(e))
