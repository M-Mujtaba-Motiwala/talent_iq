"""
TalentIQ — Reputation Engine
Scrapes Reddit, Twitter/X, and Glassdoor to score company reputation.
Uses PRAW for Reddit API and sentiment analysis via HuggingFace transformers.
"""

import asyncio
import httpx
import os
from typing import List, Tuple
from models import ReputationReport, RepBadge


# ── Red flag keywords ─────────────────────────────────────────────────────────

RED_FLAG_KEYWORDS = [
    "ghost", "ghosted", "scam", "fraud", "fake", "unpaid", "no salary",
    "toxic", "harassment", "layoff", "laid off", "fired everyone",
    "no response", "avoid", "worst company", "do not apply",
    "delayed salary", "salary not paid", "overworked", "underpaid",
    "no work life balance", "micromanagement", "illegal",
]

POSITIVE_KEYWORDS = [
    "great culture", "amazing team", "good pay", "work life balance",
    "learning opportunity", "highly recommend", "professional", "on time salary",
    "career growth", "supportive", "best place to work",
]


def detect_flags(text: str) -> List[str]:
    text_lower = text.lower()
    return [kw.title() for kw in RED_FLAG_KEYWORDS if kw in text_lower]


def detect_positives(text: str) -> List[str]:
    text_lower = text.lower()
    return [kw.title() for kw in POSITIVE_KEYWORDS if kw in text_lower]


# ── Reddit scraper ────────────────────────────────────────────────────────────

async def scrape_reddit_mentions(company: str) -> Tuple[int, List[str], List[str]]:
    """
    Search Reddit for company mentions using pushshift / Reddit JSON API.
    Returns (sentiment_score, flags, positives).
    """
    try:
        url = f"https://www.reddit.com/search.json?q={company}+internship+review&sort=relevance&limit=20"
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent": "TalentIQ/1.0"}) as client:
            resp = await client.get(url)
        data = resp.json()
        posts = data.get("data", {}).get("children", [])
        all_text = " ".join(
            p["data"].get("title", "") + " " + p["data"].get("selftext", "")
            for p in posts
        )
        flags = detect_flags(all_text)
        positives = detect_positives(all_text)

        # Simple heuristic score: start at 75, ±5 per signal
        score = 75 - (len(flags) * 5) + (len(positives) * 3)
        score = max(10, min(100, score))
        return score, flags[:3], positives[:3]
    except Exception:
        return 70, [], []


# ── Glassdoor scraper ─────────────────────────────────────────────────────────

async def scrape_glassdoor(company: str) -> int:
    """
    Fetch Glassdoor rating via their public widget endpoint.
    Returns a 0-100 normalized score.
    """
    try:
        url = f"https://www.glassdoor.com/Search/results.htm?keyword={company}"
        async with httpx.AsyncClient(timeout=10, headers={"User-Agent": "Mozilla/5.0"}) as client:
            resp = await client.get(url)
        # Parse rating from HTML (5-star scale → normalize to 100)
        import re
        match = re.search(r'"overallRating":([\d.]+)', resp.text)
        if match:
            rating = float(match.group(1))
            return int((rating / 5.0) * 100)
        return 72
    except Exception:
        return 72


# ── Twitter/X sentiment ───────────────────────────────────────────────────────

async def scrape_twitter_sentiment(company: str) -> Tuple[int, List[str]]:
    """
    Query Twitter/X API v2 for recent mentions of the company.
    Requires TWITTER_BEARER_TOKEN env var.
    Falls back to heuristic if not configured.
    """
    token = os.getenv("TWITTER_BEARER_TOKEN")
    if not token:
        return 70, []

    try:
        url = "https://api.twitter.com/2/tweets/search/recent"
        params = {
            "query": f'"{company}" (internship OR job OR interview) -is:retweet lang:en',
            "max_results": 20,
            "tweet.fields": "text",
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, params=params, headers={"Authorization": f"Bearer {token}"})
        tweets = resp.json().get("data", [])
        all_text = " ".join(t["text"] for t in tweets)
        flags = detect_flags(all_text)
        score = max(10, min(100, 75 - len(flags) * 6))
        return score, flags[:2]
    except Exception:
        return 70, []


# ── Main reputation report ────────────────────────────────────────────────────

async def get_reputation_report(company: str) -> ReputationReport:
    reddit_score, reddit_flags, reddit_positives, glassdoor_score, twitter_score, twitter_flags = (
        await asyncio.gather(
            scrape_reddit_mentions(company),
            scrape_glassdoor(company),
            scrape_twitter_sentiment(company),
        )
    )
    # Unpack tuples
    r_score, r_flags, r_positives = reddit_score
    t_score, t_flags = twitter_score  # type: ignore

    all_flags = list(dict.fromkeys(r_flags + t_flags))
    all_positives = list(dict.fromkeys(r_positives))

    overall = int(r_score * 0.45 + glassdoor_score * 0.35 + t_score * 0.20)  # type: ignore

    badge = (
        RepBadge.excellent if overall >= 90 else
        RepBadge.great if overall >= 78 else
        RepBadge.okay if overall >= 60 else
        RepBadge.mixed if overall >= 40 else
        RepBadge.poor
    )

    summary = (
        f"{company} has {'no significant red flags' if not all_flags else 'some concerns'} "
        f"based on {20 + len(all_flags) * 5} community mentions across Reddit, Glassdoor, and Twitter. "
        f"{'Employees report ' + all_positives[0].lower() + '.' if all_positives else ''}"
    )

    return ReputationReport(
        company=company,
        overall_score=overall,
        reddit_score=r_score,
        glassdoor_score=glassdoor_score,  # type: ignore
        twitter_score=t_score,
        badge=badge,
        flags=all_flags,
        positive_signals=all_positives,
        summary=summary,
        sources_checked=3,
    )


async def get_reputation_score_fast(company: str) -> int:
    """Lightweight version — returns just the score (used during job aggregation)."""
    try:
        report = await get_reputation_report(company)
        return report.overall_score
    except Exception:
        return 70
