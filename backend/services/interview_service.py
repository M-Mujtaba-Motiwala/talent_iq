"""TalentIQ — Interview Service"""

import uuid
from typing import List
from datetime import datetime
from models import InterviewSession, InterviewRoadmap, MockInterviewRequest, MockInterviewResponse
from services.ai_service import generate_interview_roadmap, mock_interview_turn as ai_mock

_sessions: List[InterviewSession] = []

async def get_interviews() -> List[InterviewSession]:
    return _sessions

async def schedule_interview(session: InterviewSession) -> InterviewSession:
    session.id = f"sess_{str(uuid.uuid4())[:6]}"
    _sessions.append(session)
    return session

async def generate_roadmap(session_id: str) -> InterviewRoadmap:
    s = next((x for x in _sessions if x.id == session_id), None)
    if not s:
        raise ValueError(f"Session {session_id} not found")
    days = max(1, (datetime.fromisoformat(s.scheduled_at) - datetime.utcnow()).days)
    return await generate_interview_roadmap(s.role, s.company, s.notes or "", days)

async def mock_interview_turn(req: MockInterviewRequest) -> MockInterviewResponse:
    return await ai_mock(req)
