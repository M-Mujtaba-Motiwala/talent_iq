"""
TalentIQ — Pydantic Models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class WorkMode(str, Enum):
    remote = "remote"
    hybrid = "hybrid"
    onsite = "on-site"


class JobType(str, Enum):
    internship = "internship"
    fulltime = "full-time"
    parttime = "part-time"
    freelance = "freelance"


class RepBadge(str, Enum):
    excellent = "excellent"
    great = "great"
    okay = "okay"
    mixed = "mixed"
    poor = "poor"


# ── Resume ────────────────────────────────────────────────────────────────────

class ParsedResume(BaseModel):
    name: str
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    skills: List[str]
    experience_years: float
    education: Optional[str]
    raw_text: str


# ── Jobs ──────────────────────────────────────────────────────────────────────

class JobSearchRequest(BaseModel):
    skills: List[str]
    location: Optional[str] = None
    job_types: List[JobType] = [JobType.internship]
    work_modes: List[WorkMode] = [WorkMode.remote, WorkMode.hybrid]
    field: Optional[str] = None
    min_rep_score: int = Field(default=0, ge=0, le=100)


class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: JobType
    work_mode: WorkMode
    salary: Optional[str]
    tags: List[str]
    posted_at: str
    source: str
    source_url: str
    match_score: int
    rep_score: int
    rep_badge: RepBadge
    growth_score: int
    flags: List[str]
    jd: Optional[str]


# ── Reputation ────────────────────────────────────────────────────────────────

class ReputationReport(BaseModel):
    company: str
    overall_score: int
    reddit_score: int
    glassdoor_score: int
    twitter_score: int
    badge: RepBadge
    flags: List[str]
    positive_signals: List[str]
    summary: str
    sources_checked: int


# ── Growth ────────────────────────────────────────────────────────────────────

class GrowthReport(BaseModel):
    company: str
    growth_score: int
    funding_stage: str
    headcount_growth_pct: float
    industry: str
    alumni_avg_promotions: float
    summary: str


# ── Applications ──────────────────────────────────────────────────────────────

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
    status: ApplicationStatus
    applied_at: str
    cover_letter: Optional[str]
    notes: Optional[str]


class CoverLetterRequest(BaseModel):
    job_title: str
    company: str
    jd: str
    resume_text: str


class CoverLetterResponse(BaseModel):
    cover_letter: str


# ── Interview ─────────────────────────────────────────────────────────────────

class InterviewSession(BaseModel):
    id: str
    company: str
    role: str
    scheduled_at: str
    type: str  # Technical, HR, Cultural
    notes: Optional[str]


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
    role: str  # "candidate" | "interviewer"
    content: str


class MockInterviewRequest(BaseModel):
    role: str
    jd: Optional[str]
    history: List[MockInterviewMessage] = []


class MockInterviewResponse(BaseModel):
    reply: str
    feedback: Optional[str]
