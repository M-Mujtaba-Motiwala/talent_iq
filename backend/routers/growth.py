from fastapi import APIRouter
from models import GrowthReport
from services.growth_scorer import score_company_growth

router = APIRouter()

@router.get("/{company}", response_model=GrowthReport)
async def growth(company: str):
    return await score_company_growth(company)
