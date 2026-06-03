"""TalentIQ — Application Engine"""

import uuid
from datetime import datetime
from typing import List
from models import Application, ApplicationStatus

_apps: List[Application] = []

async def get_all_applications() -> List[Application]:
    return _apps

async def create_application(job_id: str, job_title: str, company: str, logo: str, logo_color: str, cover_letter: str = "") -> Application:
    app = Application(
        id=str(uuid.uuid4())[:8], job_id=job_id, job_title=job_title,
        company=company, logo=logo, logo_color=logo_color,
        status=ApplicationStatus.applied,
        applied_at=datetime.utcnow().strftime("%d %b %Y"), cover_letter=cover_letter,
    )
    _apps.append(app)
    return app

async def update_status(app_id: str, status: ApplicationStatus) -> Application:
    for app in _apps:
        if app.id == app_id:
            app.status = status
            return app
    raise ValueError(f"App {app_id} not found")
