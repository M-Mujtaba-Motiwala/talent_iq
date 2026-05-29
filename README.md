# 🎯 TalentIQ — AI-Powered Job & Internship Automation Platform

<p align="center">
  <img src="docs/banner.png" alt="TalentIQ Banner" width="100%" />
</p>

<p align="center">
  <b>Find jobs. Check reputations. Auto-apply. Ace interviews — all in one AI-powered platform.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Claude-Sonnet_4-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## ✨ What is TalentIQ?

TalentIQ is a full-stack web and mobile platform that automates the entire job hunting process for developers, students, and professionals. It aggregates listings from 7+ job boards, scores each company's reputation using real Reddit/Twitter/Glassdoor data, ranks opportunities by growth potential, auto-applies on your behalf, and prepares you for interviews using a live AI mock interviewer powered by Claude.

---

## 🚀 Features

### 📄 Resume Parser
- Upload PDF or DOCX resume
- Automatically extracts: name, email, skills, experience years, education
- Skills fed directly into job search queries

### 🔍 Job Aggregator
Scrapes and normalizes listings from:
| Source | Type |
|--------|------|
| LinkedIn | All roles |
| Indeed | All roles |
| Rozee.pk | Pakistan-specific |
| Internshala | Internships |
| Remote.co | Remote roles |
| AngelList / Wellfound | Startup roles |
| We Work Remotely | Remote roles |

Filters: Remote / Hybrid / On-site · Internship / Full-time / Part-time

### 🛡️ Reputation Engine
For every company found, TalentIQ automatically:
- Scrapes **Reddit** (`r/cscareerquestions`, company subreddits)
- Analyzes **Twitter/X** mentions
- Fetches **Glassdoor** ratings
- Runs sentiment analysis on all mentions
- Flags: ghost employers, unpaid work, toxic culture, layoffs, scams
- Assigns a **Reputation Badge**: Excellent / Great / Okay / Mixed / Poor

### 📈 Growth Scorer
Scores each company's career growth potential:
- Funding stage (Seed → Series D → IPO)
- Headcount growth % (YoY via LinkedIn)
- Industry demand index
- Alumni career trajectory (avg promotions in 5 years)
- Crunchbase integration

### ✉️ Auto-Apply Engine
- AI-generates a tailored cover letter per role (Claude API)
- Playwright auto-fills application forms
- Supports PDF + DOCX resume upload
- Tracks every application in a Kanban-style pipeline

### 📅 Interview Scheduler + Roadmap
- Schedule interviews with date, time, and type
- AI generates a **day-by-day prep roadmap** from the job description
- Includes: topic breakdown, subtopics, company research, mock Q&A

### 🤖 AI Mock Interview (Live)
- Real-time conversational mock interview powered by **Claude API**
- Paste the JD for role-specific questions
- Immediate feedback after every answer
- End-of-session performance report: Communication / Technical / Structure scores
- Text-based (extendable to voice via Google Cloud Speech-to-Text)

---

## 🏗️ Architecture

```
talentiq/
├── frontend/                  # React 18 PWA (mobile-first)
│   ├── src/
│   │   ├── App.jsx            # Full UI — all screens in one component tree
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── backend/                   # FastAPI (Python 3.11)
│   ├── main.py                # App entry + CORS + router registration
│   ├── models/
│   │   └── __init__.py        # Pydantic models for all entities
│   ├── routers/
│   │   ├── resume.py          # POST /api/resume/parse
│   │   ├── jobs.py            # POST /api/jobs/search
│   │   ├── reputation.py      # GET  /api/reputation/{company}
│   │   ├── growth.py          # GET  /api/growth/{company}
│   │   ├── applications.py    # CRUD /api/applications
│   │   └── interview.py       # POST /api/interview/mock
│   ├── services/
│   │   ├── resume_parser.py   # pdfplumber + pypdf + python-docx
│   │   ├── job_aggregator.py  # httpx + BeautifulSoup scrapers
│   │   ├── reputation_engine.py # Reddit API + Glassdoor + Twitter
│   │   ├── growth_scorer.py   # Crunchbase API + heuristics
│   │   ├── application_engine.py # Playwright auto-apply
│   │   ├── interview_service.py  # Session management
│   │   └── ai_service.py      # Claude API (cover letters, roadmaps, mock interview)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/talentiq.git
cd talentiq
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

pip install -r requirements.txt
playwright install chromium

uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend setup
```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

### 4. Docker (full stack)
```bash
cp backend/.env.example .env
# Add your API keys to .env

docker-compose up --build
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Powers cover letters, roadmaps & mock interviews |
| `TWITTER_BEARER_TOKEN` | Optional | Enables Twitter reputation scraping |
| `CRUNCHBASE_API_KEY` | Optional | Richer company growth data |
| `DATABASE_URL` | Optional | PostgreSQL (defaults to in-memory) |

---

## 📱 Mobile Support

TalentIQ is built mobile-first at 480px. To use as a mobile app:

**React Native / Expo** — The UI logic in `App.jsx` can be ported to React Native with minimal changes. All state management uses plain React hooks.

**PWA** — Add a `manifest.json` and service worker to the frontend for installable PWA on Android/iOS.

---

## 🔌 API Reference

Full interactive docs at `http://localhost:8000/docs` (Swagger UI).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resume/parse` | POST | Parse resume PDF/DOCX |
| `/api/resume/generate-cover-letter` | POST | AI cover letter |
| `/api/jobs/search` | POST | Search + aggregate jobs |
| `/api/reputation/{company}` | GET | Reputation report |
| `/api/growth/{company}` | GET | Growth score report |
| `/api/applications/` | GET/POST | List / add applications |
| `/api/applications/{id}/status` | PATCH | Update status |
| `/api/applications/auto-apply/{job_id}` | POST | Auto-fill & submit |
| `/api/interview/schedule` | POST | Schedule interview |
| `/api/interview/roadmap/generate` | POST | AI prep roadmap |
| `/api/interview/mock` | POST | AI mock interview turn |

---

## 🛣️ Roadmap

- [ ] PostgreSQL integration (replace in-memory stores)
- [ ] Voice mock interviews (Google Cloud Speech-to-Text)
- [ ] LinkedIn OAuth for auto-login
- [ ] React Native mobile app
- [ ] Email/WhatsApp alerts for new matches
- [ ] ATS resume scoring
- [ ] Multi-language support (Urdu)
- [ ] Salary negotiation AI assistant

---

## 🧑‍💻 Author

**Muhammad Mujtaba Motiwala**
- GitHub: [@M-Mujtaba-Motiwala](https://github.com/M-Mujtaba-Motiwala)
- LinkedIn: [muhammad-mujtaba-motiwala](https://linkedin.com/in/muhammad-mujtaba-motiwala)
- Email: mmmotiwala2004@gmail.com

---

## 📄 License

MIT — free to use, modify, and distribute.
