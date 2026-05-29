"""
TalentIQ — Backend API
FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routers import jobs, resume, reputation, applications, interview, growth


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 TalentIQ API starting up...")
    yield
    print("👋 TalentIQ API shutting down...")


app = FastAPI(
    title="TalentIQ API",
    description="AI-powered job & internship automation platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://talentiq.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resume.router,       prefix="/api/resume",       tags=["Resume"])
app.include_router(jobs.router,         prefix="/api/jobs",         tags=["Jobs"])
app.include_router(reputation.router,   prefix="/api/reputation",   tags=["Reputation"])
app.include_router(growth.router,       prefix="/api/growth",       tags=["Growth"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(interview.router,    prefix="/api/interview",    tags=["Interview"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "TalentIQ API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
