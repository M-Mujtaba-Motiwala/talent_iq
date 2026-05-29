"""
TalentIQ — Interview Router
Manages interview scheduling, prep roadmaps, and AI mock interviews
"""

from fastapi import APIRouter
from typing import List
from models import (
    InterviewSession,
    InterviewRoadmap,
    MockInterviewRequest,
    MockInterviewResponse,
)
from services.interview_service import (
    get_interviews,
    schedule_interview,
    generate_roadmap,
    mock_interview_turn,
)

router = APIRouter()


@router.get("/", response_model=List[InterviewSession])
async def list_interviews():
    """Get all scheduled interviews."""
    return await get_interviews()


@router.post("/schedule", response_model=InterviewSession)
async def schedule(session: InterviewSession):
    """Schedule a new interview and trigger roadmap generation."""
    return await schedule_interview(session)


@router.get("/roadmap/{session_id}", response_model=InterviewRoadmap)
async def get_roadmap(session_id: str):
    """
    Generate a day-by-day prep roadmap for a scheduled interview.
    Uses the job description to build targeted topic breakdowns,
    company-specific Q&A, and a study timeline.
    """
    return await generate_roadmap(session_id)


@router.post("/roadmap/generate", response_model=InterviewRoadmap)
async def generate_roadmap_direct(role: str, company: str, jd: str, days_until: int):
    """Generate a roadmap directly without a scheduled session."""
    from services.ai_service import generate_interview_roadmap
    return await generate_interview_roadmap(role, company, jd, days_until)


@router.post("/mock", response_model=MockInterviewResponse)
async def mock_interview(req: MockInterviewRequest):
    """
    Run one turn of an AI mock interview.
    Powered by Claude API — simulates a real technical interviewer
    with dynamic follow-up questions and immediate per-answer feedback.
    """
    return await mock_interview_turn(req)
