from fastapi import APIRouter, HTTPException
from typing import List
from models import InterviewSession, InterviewRoadmap, MockInterviewRequest, MockInterviewResponse
from services.interview_service import get_interviews, schedule_interview, generate_roadmap, mock_interview_turn

router = APIRouter()

@router.get("/", response_model=List[InterviewSession])
async def list_interviews():
    return await get_interviews()

@router.post("/schedule", response_model=InterviewSession)
async def schedule(session: InterviewSession):
    return await schedule_interview(session)

@router.get("/roadmap/{session_id}", response_model=InterviewRoadmap)
async def roadmap(session_id: str):
    try:
        return await generate_roadmap(session_id)
    except ValueError as e:
        raise HTTPException(404, str(e))

@router.post("/roadmap/generate", response_model=InterviewRoadmap)
async def generate(role: str, company: str, jd: str = "", days_until: int = 7):
    from services.ai_service import generate_interview_roadmap
    return await generate_interview_roadmap(role, company, jd, days_until)

@router.post("/mock", response_model=MockInterviewResponse)
async def mock(req: MockInterviewRequest):
    return await mock_interview_turn(req)
