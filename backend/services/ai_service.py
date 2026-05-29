"""
TalentIQ — AI Service
Powered by Claude API (Anthropic) for:
  - Cover letter generation
  - Interview roadmap generation
  - Mock interview conversations
"""

import os
import httpx
import json
from typing import List
from models import InterviewRoadmap, RoadmapTopic, MockInterviewRequest, MockInterviewResponse


ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-20250514"


async def _call_claude(system: str, messages: list, max_tokens: int = 1000) -> str:
    """Core Claude API call helper."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY not set")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            ANTHROPIC_API_URL,
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": MODEL,
                "max_tokens": max_tokens,
                "system": system,
                "messages": messages,
            }
        )
    data = resp.json()
    return "".join(block.get("text", "") for block in data.get("content", []))


# ── Cover Letter ──────────────────────────────────────────────────────────────

async def generate_cover_letter(job_title: str, company: str, jd: str, resume_text: str) -> str:
    system = (
        "You are an expert career coach. Write a concise, professional, and personalized cover letter. "
        "Avoid generic phrases. Match the candidate's actual skills to the role. "
        "Format: 3 short paragraphs. No more than 200 words. No placeholders."
    )
    prompt = (
        f"Write a cover letter for:\nRole: {job_title} at {company}\n\n"
        f"Job Description:\n{jd}\n\nCandidate Resume:\n{resume_text}"
    )
    return await _call_claude(system, [{"role": "user", "content": prompt}], max_tokens=600)


# ── Interview Roadmap ─────────────────────────────────────────────────────────

async def generate_interview_roadmap(
    role: str, company: str, jd: str, days_until: int
) -> InterviewRoadmap:
    system = (
        "You are an expert technical interview coach. "
        "Generate a structured day-by-day interview preparation roadmap as JSON only. "
        "No markdown, no explanation — only valid JSON matching this schema exactly:\n"
        '{"topics": [{"day": "Day 1-2", "topic": "...", "subtopics": ["...", "..."], "done": false}], '
        '"mock_questions": ["...", "...", "..."]}'
    )
    prompt = (
        f"Create a {min(days_until, 10)}-day prep roadmap for:\n"
        f"Role: {role} at {company}\n"
        f"Days until interview: {days_until}\n"
        f"Job Description:\n{jd}\n\n"
        "Group topics by day range. Include 5-7 topics and 5 mock questions."
    )
    raw = await _call_claude(system, [{"role": "user", "content": prompt}], max_tokens=1000)

    try:
        raw = raw.strip().lstrip("```json").rstrip("```").strip()
        parsed = json.loads(raw)
        topics = [RoadmapTopic(**t) for t in parsed.get("topics", [])]
        mock_qs = parsed.get("mock_questions", [])
    except Exception:
        topics = [
            RoadmapTopic(day="Day 1-2", topic="Core language review", subtopics=["Syntax", "OOP", "Data structures"], done=False),
            RoadmapTopic(day="Day 3-4", topic="Role-specific skills", subtopics=["Key frameworks", "Libraries", "APIs"], done=False),
            RoadmapTopic(day="Day 5", topic="System design basics", subtopics=["Scalability", "Databases", "Caching"], done=False),
            RoadmapTopic(day="Day 6", topic=f"{company} research", subtopics=["Products", "Culture", "Recent news"], done=False),
            RoadmapTopic(day="Day 7", topic="Mock interview practice", subtopics=["Behavioral STAR", "Technical walkthrough"], done=False),
        ]
        mock_qs = [
            "Tell me about yourself.",
            "Describe a challenging project and how you solved it.",
            "How would you approach debugging a performance issue in production?",
            "Walk me through your most complex coding project.",
            "Where do you see yourself in 3 years?",
        ]

    return InterviewRoadmap(
        role=role,
        company=company,
        days_until=days_until,
        topics=topics,
        mock_questions=mock_qs,
    )


# ── Mock Interview ────────────────────────────────────────────────────────────

async def mock_interview_turn(req: MockInterviewRequest) -> MockInterviewResponse:
    system = (
        f"You are an expert technical interviewer at a top company. "
        f"You are interviewing a candidate for: {req.role}.\n"
        + (f"Job Description: {req.jd}\n" if req.jd else "")
        + "Conduct a realistic interview:\n"
        "1. Ask one question at a time\n"
        "2. Give a brief 1-sentence tip after the candidate answers\n"
        "3. Then ask the next question\n"
        "4. Be encouraging but realistic\n"
        "Keep responses under 100 words."
    )

    history = [
        {"role": "user" if m.role == "candidate" else "assistant", "content": m.content}
        for m in req.history
    ]

    if not history:
        history = [{"role": "user", "content": "Start the interview with a warm welcome and your first question."}]

    reply = await _call_claude(system, history, max_tokens=300)
    return MockInterviewResponse(reply=reply, feedback=None)
