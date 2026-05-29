"""
TalentIQ — Growth Router
Scores company growth potential based on funding, headcount, alumni paths
"""

from fastapi import APIRouter
from models import GrowthReport
from services.growth_scorer import score_company_growth

router = APIRouter()


@router.get("/{company_name}", response_model=GrowthReport)
async def company_growth(company_name: str):
    """
    Returns a growth score and report for a company.
    Pulls data from Crunchbase API + LinkedIn alumni tracking.
    Scores: funding stage, headcount growth, industry demand,
    and average career trajectory of alumni.
    """
    return await score_company_growth(company_name)
