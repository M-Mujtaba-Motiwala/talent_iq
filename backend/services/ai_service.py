"""TalentIQ — AI Service (Claude API)"""

import os, httpx, json
from models import InterviewRoadmap, RoadmapTopic, MockInterviewRequest, MockInterviewResponse

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-20250514"


async def _claude(system: str, messages: list, max_tokens: int = 800) -> str:
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        raise EnvironmentError("ANTHROPIC_API_KEY not set")
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(ANTHROPIC_URL, headers={
            "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"
        }, json={"model": MODEL, "max_tokens": max_tokens, "system": system, "messages": messages})
    data = r.json()
    return "".join(b.get("text", "") for b in data.get("content", []))


async def generate_cover_letter(job_title: str, company: str, jd: str, resume_text: str) -> str:
    return await _claude(
        "You are an expert career coach. Write a concise, personalized cover letter in 3 short paragraphs, max 200 words. No placeholders. Match candidate's real skills to the role.",
        [{"role": "user", "content": f"Role: {job_title} at {company}\nJD: {jd}\nResume: {resume_text}"}],
        600
    )


async def generate_interview_roadmap(role: str, company: str, jd: str, days_until: int) -> InterviewRoadmap:
    raw = await _claude(
        'Return ONLY valid JSON: {"topics":[{"day":"Day 1-2","topic":"...","subtopics":["..."],"done":false}],"mock_questions":["..."]}',
        [{"role": "user", "content": f"Create a {min(days_until,10)}-day prep roadmap for {role} at {company}. JD: {jd}. Include 5-6 topics and 5 mock questions."}],
        1000
    )
    try:
        clean = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        parsed = json.loads(clean)
        return InterviewRoadmap(
            role=role, company=company, days_until=days_until,
            topics=[RoadmapTopic(**t) for t in parsed.get("topics", [])],
            mock_questions=parsed.get("mock_questions", [])
        )
    except Exception:
        return InterviewRoadmap(
            role=role, company=company, days_until=days_until,
            topics=[
                RoadmapTopic(day="Day 1-2", topic="Core language review", subtopics=["Syntax","OOP","Data structures"], done=False),
                RoadmapTopic(day="Day 3-4", topic="Role-specific frameworks", subtopics=["Key libraries","APIs","Tools"], done=False),
                RoadmapTopic(day="Day 5",   topic="System design basics",    subtopics=["Scalability","Databases","Caching"], done=False),
                RoadmapTopic(day="Day 6",   topic=f"{company} research",     subtopics=["Products","Culture","News"], done=False),
                RoadmapTopic(day="Day 7",   topic="Mock interview practice", subtopics=["STAR method","Technical Q&A"], done=False),
            ],
            mock_questions=[
                "Tell me about yourself and your background.",
                "Describe the most complex project you've built.",
                "How do you approach debugging a production issue?",
                "Where do you see yourself in 3 years?",
                "Why do you want to work at this company specifically?",
            ]
        )


async def mock_interview_turn(req: MockInterviewRequest) -> MockInterviewResponse:
    system = (
        f"You are an expert technical interviewer. Role: {req.role}.\n"
        + (f"JD: {req.jd}\n" if req.jd else "")
        + "Conduct a realistic interview. Ask ONE question per turn. Give a 1-sentence tip after each candidate answer, then ask the next question. Under 80 words per response."
    )
    history = [{"role": "user" if m.role == "candidate" else "assistant", "content": m.content} for m in req.history]
    if not history:
        history = [{"role": "user", "content": "Start the interview with a warm welcome and your first question."}]
    reply = await _claude(system, history, 300)
    return MockInterviewResponse(reply=reply)
