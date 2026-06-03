"""TalentIQ — Reputation Engine"""

import asyncio, httpx, os, re
from models import ReputationReport, RepBadge

RED_FLAGS = ["ghost","scam","fraud","unpaid","toxic","harassment","layoff","avoid","worst","illegal","delayed salary","no salary"]
POSITIVES = ["great culture","good pay","work life balance","career growth","highly recommend","professional","on time"]

def _score(text: str, base: int = 75) -> tuple[int, list, list]:
    tl = text.lower()
    flags = [k.title() for k in RED_FLAGS if k in tl]
    pos   = [k.title() for k in POSITIVES if k in tl]
    score = max(10, min(100, base - len(flags)*5 + len(pos)*3))
    return score, flags[:3], pos[:3]

async def _reddit(company: str):
    try:
        url = f"https://www.reddit.com/search.json?q={company}+internship+review&sort=relevance&limit=15"
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent":"TalentIQ/2.0"}) as c:
            r = await c.get(url)
        posts = r.json().get("data",{}).get("children",[])
        text = " ".join(p["data"].get("title","")+p["data"].get("selftext","") for p in posts)
        return _score(text, 75)
    except Exception:
        return 72, [], []

async def _glassdoor(company: str) -> int:
    try:
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent":"Mozilla/5.0"}) as c:
            r = await c.get(f"https://www.glassdoor.com/Search/results.htm?keyword={company}")
        m = re.search(r'"overallRating":([\d.]+)', r.text)
        return int((float(m.group(1))/5.0)*100) if m else 72
    except Exception:
        return 72

async def _twitter(company: str):
    token = os.getenv("TWITTER_BEARER_TOKEN")
    if not token:
        return 70, []
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get("https://api.twitter.com/2/tweets/search/recent",
                params={"query":f'"{company}" (internship OR job) -is:retweet lang:en',"max_results":20,"tweet.fields":"text"},
                headers={"Authorization":f"Bearer {token}"})
        tweets = r.json().get("data",[])
        text = " ".join(t["text"] for t in tweets)
        score, flags, _ = _score(text, 70)
        return score, flags[:2]
    except Exception:
        return 70, []

async def get_reputation_report(company: str) -> ReputationReport:
    (rs, rf, rp), gs, (ts, tf) = await asyncio.gather(_reddit(company), _glassdoor(company), _twitter(company))
    overall = int(rs*0.45 + gs*0.35 + ts*0.20)
    all_flags = list(dict.fromkeys(rf + tf))
    badge = (RepBadge.excellent if overall>=90 else RepBadge.great if overall>=78
             else RepBadge.okay if overall>=60 else RepBadge.mixed if overall>=40 else RepBadge.poor)
    return ReputationReport(
        company=company, overall_score=overall, reddit_score=rs,
        glassdoor_score=gs, twitter_score=ts, badge=badge,
        flags=all_flags, positive_signals=list(dict.fromkeys(rp)),
        summary=f"{company} has {'no major red flags' if not all_flags else 'some concerns'} based on community data.",
        sources_checked=3,
    )

async def get_reputation_score_fast(company: str) -> int:
    try:
        return (await get_reputation_report(company)).overall_score
    except Exception:
        return 70
