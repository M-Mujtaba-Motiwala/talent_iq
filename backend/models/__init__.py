"""TalentIQ — Pydantic Models v2"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class WorkMode(str, Enum):
    remote = "Remote"
    hybrid = "Hybrid"
    onsite = "On-site"


class JobType(str, Enum):
    internship = "Internship"
    fulltime = "Full-time"
    parttime = "Part-time"
    freelance = "Freelance"


class RepBadge(str, Enum):
    excellent = "excellent"
    great = "great"
    okay = "okay"
    mixed = "mixed"
    poor = "poor"


class ParsedResume(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0.0
    education: Optional[str] = None
    raw_text: str = ""


class JobSearchRequest(BaseModel):
    skills: List[str]
    location: Optional[str] = None
    job_types: List[JobType] = [JobType.internship]
    work_modes: List[WorkMode] = [WorkMode.remote, WorkMode.hybrid, WorkMode.onsite]
    field: Optional[str] = None
    min_match: int = Field(default=60, ge=0, le=100)
    max_match: int = Field(default=75, ge=0, le=100)
    min_rep_score: int = Field(default=0, ge=0, le=100)


class JobListing(BaseModel):
    id: str
    title: str
    company: str
    logo: str
    logo_color: str
    location: str
    mode: WorkMode
    type: JobType
    salary: Optional[str] = None
    tags: List[str] = []
    posted_at: str
    source: str
    source_url: str
    apply_url: str
    match: int
    rep: int
    growth: int
    rep_badge: RepBadge
    flags: List[str] = []
    jd: Optional[str] = None
    about: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    funding: Optional[str] = None


class ReputationReport(BaseModel):
    company: str
    overall_score: int
    reddit_score: int
    glassdoor_score: int
    twitter_score: int
    badge: RepBadge
    flags: List[str] = []
    positive_signals: List[str] = []
    summary: str
    sources_checked: int = 3


class GrowthReport(BaseModel):
    company: str
    growth_score: int
    funding_stage: str
    headcount_growth_pct: float
    industry: str
    alumni_avg_promotions: float
    summary: str


class ApplicationStatus(str, Enum):
    applied = "Applied"
    screening = "Screening"
    interview = "Interview"
    offer = "Offer"
    rejected = "Rejected"


class Application(BaseModel):
    id: str
    job_id: str
    job_title: str
    company: str
    logo: str
    logo_color: str
    status: ApplicationStatus
    applied_at: str
    cover_letter: Optional[str] = None
    notes: Optional[str] = None


class InterviewSession(BaseModel):
    id: str
    company: str
    role: str
    scheduled_at: str
    type: str
    notes: Optional[str] = None


class RoadmapTopic(BaseModel):
    day: str
    topic: str
    subtopics: List[str]
    done: bool = False


class InterviewRoadmap(BaseModel):
    role: str
    company: str
    days_until: int
    topics: List[RoadmapTopic]
    mock_questions: List[str]


class MockInterviewMessage(BaseModel):
    role: str
    content: str


class MockInterviewRequest(BaseModel):
    role: str
    jd: Optional[str] = None
    history: List[MockInterviewMessage] = []


class MockInterviewResponse(BaseModel):
    reply: str
    feedback: Optional[str] = None


class CoverLetterRequest(BaseModel):
    job_title: str
    company: str
    jd: str
    resume_text: str


class CoverLetterResponse(BaseModel):
    cover_letter: str
