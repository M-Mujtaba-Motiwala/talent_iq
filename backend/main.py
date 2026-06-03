"""
TalentIQ Backend v2 — FastAPI
Render-ready deployment
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from routers import jobs, resume, reputation, applications, interview, growth


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 TalentIQ API v2 starting…")
    yield
    print("👋 TalentIQ API shutting down…")


app = FastAPI(
    title="TalentIQ API",
    description="AI-powered job & internship automation — reputation engine, growth scorer, AI mock interview",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Allow Vercel frontend + localhost dev
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://talentiq.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_origin_regex=r"https://talentiq.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router,       prefix="/api/resume",       tags=["Resume"])
app.include_router(jobs.router,         prefix="/api/jobs",         tags=["Jobs"])
app.include_router(reputation.router,   prefix="/api/reputation",   tags=["Reputation"])
app.include_router(growth.router,       prefix="/api/growth",       tags=["Growth"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(interview.router,    prefix="/api/interview",    tags=["Interview"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "TalentIQ API", "version": "2.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
