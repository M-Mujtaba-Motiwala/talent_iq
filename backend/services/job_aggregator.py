"""
TalentIQ — Job Aggregator Service
Scrapes and normalizes listings from multiple job boards.
Uses Playwright for JS-heavy sites and httpx/BeautifulSoup for static pages.
"""

import asyncio
import hashlib
import httpx
from bs4 import BeautifulSoup
from typing import List
from models import JobListing, JobSearchRequest, WorkMode, JobType, RepBadge
from services.reputation_engine import get_reputation_score_fast
from services.growth_scorer import get_growth_score_fast


# ── Source scrapers ───────────────────────────────────────────────────────────

async def scrape_rozee(skills: List[str], location: str = None) -> List[dict]:
    """Scrape Rozee.pk for Pakistani job listings."""
    query = "+".join(skills[:3])
    url = f"https://www.rozee.pk/job/jsearch/q/{query}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        jobs = []
        for card in soup.select(".job-listing")[:10]:
            title = card.select_one(".job-title")
            company = card.select_one(".company-name")
            if title and company:
                jobs.append({
                    "title": title.get_text(strip=True),
                    "company": company.get_text(strip=True),
                    "source": "rozee.pk",
                    "location": location or "Pakistan",
                })
        return jobs
    except Exception:
        return []


async def scrape_internshala(skills: List[str]) -> List[dict]:
    """Scrape Internshala for internship listings."""
    query = "-".join(skills[:2]).lower()
    url = f"https://internshala.com/internships/{query}-internship"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        jobs = []
        for card in soup.select(".internship_meta")[:10]:
            title = card.select_one(".profile")
            company = card.select_one(".company_name")
            if title and company:
                jobs.append({
                    "title": title.get_text(strip=True),
                    "company": company.get_text(strip=True),
                    "source": "internshala",
                    "location": "Remote / India",
                })
        return jobs
    except Exception:
        return []


async def scrape_remotive(skills: List[str]) -> List[dict]:
    """Scrape Remotive API for remote jobs."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                "https://remotive.com/api/remote-jobs",
                params={"search": " ".join(skills[:2]), "limit": 10}
            )
        data = resp.json()
        jobs = []
        for job in data.get("jobs", []):
            jobs.append({
                "title": job.get("title"),
                "company": job.get("company_name"),
                "source": "remotive.com",
                "location": "Remote",
                "source_url": job.get("url", ""),
                "tags": job.get("tags", []),
            })
        return jobs
    except Exception:
        return []


# ── Score helpers ─────────────────────────────────────────────────────────────

def compute_match_score(job_tags: List[str], skills: List[str]) -> int:
    if not job_tags or not skills:
        return 60
    skills_lower = {s.lower() for s in skills}
    tags_lower = {t.lower() for t in job_tags}
    overlap = len(skills_lower & tags_lower)
    return min(99, 55 + int((overlap / max(len(tags_lower), 1)) * 45))


def badge_from_score(score: int) -> RepBadge:
    if score >= 90: return RepBadge.excellent
    if score >= 78: return RepBadge.great
    if score >= 60: return RepBadge.okay
    if score >= 40: return RepBadge.mixed
    return RepBadge.poor


def normalize_job(raw: dict, skills: List[str]) -> JobListing:
    tags = raw.get("tags", [])
    rep = raw.get("rep_score", 75)
    growth = raw.get("growth_score", 70)
    uid = hashlib.md5(f"{raw.get('title')}{raw.get('company')}".encode()).hexdigest()[:12]

    return JobListing(
        id=uid,
        title=raw.get("title", ""),
        company=raw.get("company", ""),
        location=raw.get("location", "Remote"),
        type=raw.get("type", JobType.internship),
        work_mode=raw.get("work_mode", WorkMode.remote),
        salary=raw.get("salary"),
        tags=tags[:6],
        posted_at=raw.get("posted_at", "Recently"),
        source=raw.get("source", ""),
        source_url=raw.get("source_url", ""),
        match_score=compute_match_score(tags, skills),
        rep_score=rep,
        rep_badge=badge_from_score(rep),
        growth_score=growth,
        flags=raw.get("flags", []),
        jd=raw.get("jd"),
    )


# ── Main aggregator ───────────────────────────────────────────────────────────

async def aggregate_jobs(request: JobSearchRequest) -> List[JobListing]:
    """
    Run all scrapers concurrently, deduplicate, enrich with reputation
    and growth scores, filter by minimum rep score, and sort by match.
    """
    raw_results = await asyncio.gather(
        scrape_rozee(request.skills, request.location),
        scrape_internshala(request.skills),
        scrape_remotive(request.skills),
        return_exceptions=True,
    )

    all_raw = []
    for result in raw_results:
        if isinstance(result, list):
            all_raw.extend(result)

    # Enrich with rep + growth scores concurrently
    companies = list({r.get("company") for r in all_raw if r.get("company")})
    rep_scores, growth_scores = await asyncio.gather(
        asyncio.gather(*[get_reputation_score_fast(c) for c in companies]),
        asyncio.gather(*[get_growth_score_fast(c) for c in companies]),
    )
    rep_map = dict(zip(companies, rep_scores))
    growth_map = dict(zip(companies, growth_scores))

    for raw in all_raw:
        co = raw.get("company", "")
        raw["rep_score"] = rep_map.get(co, 70)
        raw["growth_score"] = growth_map.get(co, 65)

    listings = [normalize_job(r, request.skills) for r in all_raw if r.get("title")]

    # Filter
    listings = [j for j in listings if j.rep_score >= request.min_rep_score]

    # Deduplicate by id
    seen = set()
    unique = []
    for j in listings:
        if j.id not in seen:
            seen.add(j.id)
            unique.append(j)

    # Sort by match score descending
    unique.sort(key=lambda j: j.match_score, reverse=True)
    return unique[:50]


async def get_job_by_id(job_id: str) -> JobListing:
    # In production: look up from DB or cache
    raise NotImplementedError("Job lookup by ID requires database integration")
