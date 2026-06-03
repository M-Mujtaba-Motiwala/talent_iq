from fastapi import APIRouter
from models import ReputationReport
from services.reputation_engine import get_reputation_report
import asyncio

router = APIRouter()

@router.get("/{company}", response_model=ReputationReport)
async def reputation(company: str):
    return await get_reputation_report(company)

@router.post("/batch")
async def batch(companies: list[str]):
    return await asyncio.gather(*[get_reputation_report(c) for c in companies])
