# 🎯 TalentIQ v2 — AI-Powered Job & Internship Automation

<p align="center">
  <b>Find jobs · Check reputations · Auto-apply · Ace interviews — all in one AI-powered platform.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/Claude-Sonnet_4-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-black?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 Resume Parser | Upload PDF/DOCX → auto-extract skills, experience, education |
| 🔍 Job Aggregator | Scrapes LinkedIn, Rozee.pk, Internshala, Remotive, AngelList |
| 🎯 Smart Matching | 60–75% match range tailored to your resume skills |
| 🔗 Direct Links | Every job card links directly to the original post & apply page |
| 🛡️ Reputation Engine | Reddit + Glassdoor + Twitter/X sentiment scoring with red flag detection |
| 📈 Growth Scorer | Funding stage, headcount growth, alumni trajectory via Crunchbase |
| ✉️ AI Cover Letters | Claude generates tailored cover letters per role |
| 📅 Interview Roadmap | Day-by-day AI prep plan generated from the job description |
| 🤖 AI Mock Interview | Live conversational mock interview powered by Claude API |

---

## 🏗️ Project Structure

```
talentiq/
├── frontend/                    # React 18 — deployed on Vercel
│   ├── src/
│   │   ├── App.jsx              # Full app (all screens, state, routing)
│   │   └── index.js
│   ├── public/index.html
│   ├── vercel.json              # Vercel config (SPA rewrites + headers)
│   └── package.json
│
├── backend/                     # FastAPI — deployed on Render
│   ├── main.py                  # App entry + CORS
│   ├── models/__init__.py       # All Pydantic models
│   ├── routers/
│   │   ├── resume.py            # POST /api/resume/parse
│   │   ├── jobs.py              # POST /api/jobs/search
│   │   ├── reputation.py        # GET  /api/reputation/{company}
│   │   ├── growth.py            # GET  /api/growth/{company}
│   │   ├── applications.py      # CRUD /api/applications
│   │   └── interview.py         # POST /api/interview/mock
│   ├── services/
│   │   ├── resume_parser.py     # pdfplumber + pypdf + python-docx
│   │   ├── job_aggregator.py    # httpx + BeautifulSoup scrapers
│   │   ├── reputation_engine.py # Reddit + Glassdoor + Twitter
│   │   ├── growth_scorer.py     # Crunchbase API
│   │   ├── application_engine.py
│   │   ├── interview_service.py
│   │   └── ai_service.py        # Claude API (cover letters, roadmaps, mock interview)
│   ├── requirements.txt
│   ├── runtime.txt              # Python 3.11.9 (required for Render)
│   └── .env.example
│
├── render.yaml                  # Render deployment config
└── .gitignore
```

---

## 🚀 Quick Deploy

### Frontend → Vercel (free)

```bash
cd frontend
npm install
npx vercel --prod
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new):
- **Root directory**: `frontend`
- **Build command**: `npm run build`
- **Output directory**: `build`
- **Environment variable**: `REACT_APP_API_URL` = your Render backend URL

### Backend → Render (free)

1. Push to GitHub
2. Go to [render.com/new](https://render.com/new) → **Web Service** → Connect repo
3. Settings:
   - **Root directory**: `backend`
   - **Runtime**: Python 3
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `ANTHROPIC_API_KEY` → your key from [console.anthropic.com](https://console.anthropic.com)
   - `FRONTEND_URL` → your Vercel URL
   - `PYTHON_VERSION` → `3.11.9`

API docs available at: `https://your-backend.onrender.com/docs`

---

## ⚙️ Local Development

```bash
# Backend
cd backend
cp .env.example .env          # add your ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Cover letters, roadmaps, mock interview |
| `FRONTEND_URL` | ✅ | Your Vercel URL (for CORS) |
| `TWITTER_BEARER_TOKEN` | Optional | Twitter reputation checks |
| `CRUNCHBASE_API_KEY` | Optional | Richer company growth data |

---

## 🎯 Match Scoring

TalentIQ deliberately shows jobs in the **60–75% match range** — positions where you are strong enough to be competitive but where the role still offers meaningful growth. Perfect matches (>90%) tend to be boring; stretch roles (>75%) tend to filter candidates out. The 60–75% sweet spot is where the best learning and career growth happen.

---

## 🛣️ Roadmap

- [ ] PostgreSQL persistence (replace in-memory stores)
- [ ] Voice mock interview (Google Cloud Speech-to-Text)
- [ ] LinkedIn OAuth auto-login
- [ ] React Native mobile app
- [ ] ATS resume scoring
- [ ] Salary negotiation AI assistant
- [ ] WhatsApp alerts for new matches

---

## 🧑‍💻 Author

**Muhammad Mujtaba Motiwala**
- GitHub: [@M-Mujtaba-Motiwala](https://github.com/M-Mujtaba-Motiwala)
- LinkedIn: [muhammad-mujtaba-motiwala](https://linkedin.com/in/muhammad-mujtaba-motiwala)
- Email: mmmotiwala2004@gmail.com

---

## 📄 License

MIT — free to use, modify, and distribute.
