"""
TalentIQ — Resume Parser Service
Extracts structured data from PDF and DOCX resumes
"""

import io
import re
from typing import List
from models import ParsedResume


# ── Skill keyword bank ────────────────────────────────────────────────────────

SKILL_KEYWORDS = [
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "kotlin", "swift", "r", "scala", "php", "ruby", "dart", "assembly",
    # Web
    "react", "vue", "angular", "next.js", "node.js", "express", "django",
    "flask", "fastapi", "html", "css", "tailwind", "graphql", "rest",
    # ML / AI
    "pytorch", "tensorflow", "keras", "scikit-learn", "huggingface",
    "transformers", "bert", "llm", "nlp", "computer vision", "rag",
    "machine learning", "deep learning", "data science",
    # Data
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite",
    "pandas", "numpy", "matplotlib", "power bi", "tableau",
    # DevOps / Cloud
    "docker", "kubernetes", "aws", "gcp", "azure", "git", "github",
    "ci/cd", "linux", "bash",
    # Mobile
    "flutter", "react native", "android", "ios",
]


def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for skill in SKILL_KEYWORDS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill.title() if len(skill) > 3 else skill.upper())
    return list(dict.fromkeys(found))  # deduplicate preserving order


def extract_email(text: str) -> str:
    match = re.search(r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}', text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str:
    match = re.search(r'(\+92|0)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})', text)
    return match.group(0).strip() if match else None


def extract_name(text: str) -> str:
    """Extract name from first non-empty line."""
    for line in text.split('\n'):
        line = line.strip()
        if line and len(line.split()) >= 2 and len(line) < 60:
            if not re.search(r'[@|•|/]', line):
                return line
    return "Unknown"


def estimate_experience(text: str) -> float:
    """Rough experience estimate from year mentions."""
    years = re.findall(r'(20\d{2})', text)
    if len(years) >= 2:
        years = sorted(set(int(y) for y in years))
        return round((years[-1] - years[0]) / 1.0, 1)
    return 0.0


async def parse_resume(content: bytes, filename: str) -> ParsedResume:
    """Parse a PDF or DOCX resume and extract structured data."""

    text = ""

    if filename.endswith(".pdf"):
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except ImportError:
            # Fallback: pypdf
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                text += page.extract_text() + "\n"

    elif filename.endswith(".docx"):
        from docx import Document
        doc = Document(io.BytesIO(content))
        text = "\n".join(p.text for p in doc.paragraphs)

    return ParsedResume(
        name=extract_name(text),
        email=extract_email(text),
        phone=extract_phone(text),
        location=None,  # TODO: NER-based location extraction
        skills=extract_skills(text),
        experience_years=estimate_experience(text),
        education=None,
        raw_text=text[:5000],  # truncate for storage
    )
