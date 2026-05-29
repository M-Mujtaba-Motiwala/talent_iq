"""
TalentIQ — Jobs Router
Aggregates listings from multiple job boards
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from models import JobListing, JobSearchRequest
from services.job_aggregator import aggregate_jobs

router = APIRouter()


@router.post("/search", response_model=List[JobListing])
async def search_jobs(request: JobSearchRequest):
    """
    Search jobs across LinkedIn, Indeed, Rozee.pk, Internshala,
    Remote.co, AngelList. Filters by skills, location, type, and work mode.
    Results are enriched with reputation and growth scores.
    """
    return await aggregate_jobs(request)


@router.get("/{job_id}", response_model=JobListing)
async def get_job(job_id: str):
    """Get full details of a specific job listing."""
    from services.job_aggregator import get_job_by_id
    return await get_job_by_id(job_id)


@router.get("/sources/list")
async def list_sources():
    """Return available job board sources."""
    return {
        "sources": [
            {"id": "linkedin",    "name": "LinkedIn",     "active": True},
            {"id": "indeed",      "name": "Indeed",       "active": True},
            {"id": "rozee",       "name": "Rozee.pk",     "active": True},
            {"id": "internshala", "name": "Internshala",  "active": True},
            {"id": "remote_co",   "name": "Remote.co",    "active": True},
            {"id": "angellist",   "name": "AngelList",    "active": True},
            {"id": "weworkremotely", "name": "WWR",       "active": True},
        ]
    }
