"""
TalentIQ — Interview Service
Manages sessions, generates roadmaps, and runs mock interviews.
"""

import uuid
from typing import List
from datetime import datetime
from models import InterviewSession, InterviewRoadmap, MockInterviewRequest, MockInterviewResponse
from services.ai_service import generate_interview_roadmap, mock_interview_turn as ai_mock

_sessions: List[InterviewSession] = [
    InterviewSession(
        id="sess_001",
        company="Arbisoft",
        role="ML Engineer Intern",
        scheduled_at="2026-06-05T11:00:00",
        type="Technical",
        notes="Prepare ML system design + NLP basics",
    )
]


async def get_interviews() -> List[InterviewSession]:
    return _sessions


async def schedule_interview(session: InterviewSession) -> InterviewSession:
    session.id = f"sess_{str(uuid.uuid4())[:6]}"
    _sessions.append(session)
    return session


async def generate_roadmap(session_id: str) -> InterviewRoadmap:
    session = next((s for s in _sessions if s.id == session_id), None)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    scheduled = datetime.fromisoformat(session.scheduled_at)
    days_until = max(1, (scheduled - datetime.utcnow()).days)

    return await generate_interview_roadmap(
        role=session.role,
        company=session.company,
        jd=session.notes or "",
        days_until=days_until,
    )


async def mock_interview_turn(req: MockInterviewRequest) -> MockInterviewResponse:
    return await ai_mock(req)
