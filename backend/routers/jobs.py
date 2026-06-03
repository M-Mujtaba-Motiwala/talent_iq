from fastapi import APIRouter
from typing import List
from models import JobListing, JobSearchRequest
from services.job_aggregator import aggregate_jobs

router = APIRouter()

@router.post("/search", response_model=List[JobListing])
async def search(request: JobSearchRequest):
    """Search jobs across all boards. Match range: 60-75%."""
    return await aggregate_jobs(request)

@router.get("/sources")
async def sources():
    return {"sources": [
        {"id":"linkedin",    "name":"LinkedIn",    "url":"https://linkedin.com/jobs"},
        {"id":"rozee",       "name":"Rozee.pk",    "url":"https://rozee.pk"},
        {"id":"internshala", "name":"Internshala", "url":"https://internshala.com"},
        {"id":"remotive",    "name":"Remotive",    "url":"https://remotive.com"},
        {"id":"wwr",         "name":"We Work Remotely", "url":"https://weworkremotely.com"},
        {"id":"angellist",   "name":"AngelList",   "url":"https://wellfound.com"},
    ]}
