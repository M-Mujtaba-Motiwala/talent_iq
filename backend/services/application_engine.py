"""
TalentIQ — Application Engine
Tracks applications and auto-fills job forms using Playwright.
"""

import uuid
from datetime import datetime
from typing import List
from models import Application, ApplicationStatus

# In-memory store (replace with PostgreSQL in production)
_applications: List[Application] = []


async def get_all_applications() -> List[Application]:
    return _applications


async def create_application(job_id: str, cover_letter: str = "") -> Application:
    app = Application(
        id=str(uuid.uuid4())[:8],
        job_id=job_id,
        job_title="",  # TODO: fetch from job service
        company="",
        status=ApplicationStatus.applied,
        applied_at=datetime.utcnow().isoformat(),
        cover_letter=cover_letter,
        notes=None,
    )
    _applications.append(app)
    return app


async def update_application_status(app_id: str, status: ApplicationStatus) -> Application:
    for app in _applications:
        if app.id == app_id:
            app.status = status
            return app
    raise ValueError(f"Application {app_id} not found")


async def auto_apply(job_id: str, resume_text: str, cover_letter: str) -> dict:
    """
    Uses Playwright to auto-fill and submit a job application form.

    Steps:
    1. Fetch job URL from DB
    2. Launch headless Chromium
    3. Navigate to application page
    4. Fill: name, email, phone, cover letter, resume upload
    5. Submit form
    6. Return success/failure + confirmation URL

    Requires: playwright, playwright install chromium
    """
    try:
        from playwright.async_api import async_playwright

        # TODO: fetch job URL from database
        job_url = f"https://example-job-board.com/apply/{job_id}"

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(job_url, timeout=30000)

            # Generic field selectors — extend per job board
            await page.fill('input[name="name"], input[placeholder*="name" i]', "Muhammad Mujtaba")
            await page.fill('input[type="email"]', "mmmotiwala2004@gmail.com")
            await page.fill('textarea[name="cover_letter"], textarea[placeholder*="cover" i]', cover_letter)

            # Resume upload
            file_input = page.locator('input[type="file"]')
            if await file_input.count() > 0:
                # Would save resume to temp file and upload
                pass

            # Submit
            await page.click('button[type="submit"], input[type="submit"]')
            await page.wait_for_load_state("networkidle")

            confirmation_url = page.url
            await browser.close()

        return {"success": True, "confirmation_url": confirmation_url}

    except Exception as e:
        return {"success": False, "error": str(e)}
