"""
TalentIQ — Reputation Router
Scrapes Reddit, Twitter/X, Glassdoor and scores company reputation
"""

from fastapi import APIRouter
from models import ReputationReport
from services.reputation_engine import get_reputation_report

router = APIRouter()


@router.get("/{company_name}", response_model=ReputationReport)
async def company_reputation(company_name: str):
    """
    Returns a reputation report for a company. Aggregates sentiment
    from Reddit (r/cscareerquestions, company subreddits), Twitter/X,
    and Glassdoor. Flags toxic culture, scams, and layoff news.
    """
    return await get_reputation_report(company_name)


@router.post("/batch")
async def batch_reputation(companies: list[str]):
    """Check reputation for multiple companies at once."""
    import asyncio
    results = await asyncio.gather(*[get_reputation_report(c) for c in companies])
    return results
