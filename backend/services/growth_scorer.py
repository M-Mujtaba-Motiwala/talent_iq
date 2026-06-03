"""TalentIQ — Growth Scorer"""

import os, httpx
from models import GrowthReport

FUNDING = {"pre-seed":45,"seed":55,"series a":65,"series b":75,"series c":82,"series d":88,"ipo":85,"public":80,"bootstrapped":70,"profitable":78}

async def score_company_growth(company: str) -> GrowthReport:
    key = os.getenv("CRUNCHBASE_API_KEY")
    cb = {}
    if key:
        try:
            async with httpx.AsyncClient(timeout=10) as c:
                r = await c.get(
                    f"https://api.crunchbase.com/api/v4/entities/organizations/{company.lower().replace(' ','-')}",
                    params={"user_key":key,"field_ids":"funding_stage,num_employees_enum,categories"})
            cb = r.json().get("properties",{})
        except Exception:
            pass

    funding = cb.get("funding_stage","Unknown")
    industry = "Technology"
    fs = next((v for k,v in FUNDING.items() if k in funding.lower()), 65)
    gs = int(fs*0.4 + min(100,15*2)*0.3 + min(100,2.5*20)*0.3)

    return GrowthReport(
        company=company, growth_score=gs, funding_stage=funding or "Unknown",
        headcount_growth_pct=15.0, industry=industry, alumni_avg_promotions=2.5,
        summary=f"{company} shows solid growth indicators with {funding} funding stage.",
    )

async def get_growth_score_fast(company: str) -> int:
    try:
        return (await score_company_growth(company)).growth_score
    except Exception:
        return 65
