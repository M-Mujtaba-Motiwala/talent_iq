"""TalentIQ — Resume Parser"""

import io, re
from typing import List
from models import ParsedResume

SKILLS = [
    "python","javascript","typescript","java","c++","c#","go","rust","kotlin","swift","r","scala","php","ruby","dart",
    "react","vue","angular","next.js","node.js","express","django","flask","fastapi","html","css","tailwind","graphql",
    "pytorch","tensorflow","keras","scikit-learn","huggingface","transformers","bert","llm","nlp","rag","machine learning","deep learning",
    "sql","mysql","postgresql","mongodb","redis","sqlite","pandas","numpy","matplotlib","power bi","tableau",
    "docker","kubernetes","aws","gcp","azure","git","github","linux","bash","ci/cd",
    "flutter","react native","android","ios","figma",
]

def extract_skills(text: str) -> List[str]:
    tl = text.lower()
    return list(dict.fromkeys(
        s.title() if len(s)>3 else s.upper()
        for s in SKILLS if re.search(r'\b'+re.escape(s)+r'\b', tl)
    ))

def extract_email(text: str):
    m = re.search(r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}', text)
    return m.group(0) if m else None

def extract_phone(text: str):
    m = re.search(r'(\+92|0)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})', text)
    return m.group(0).strip() if m else None

def extract_name(text: str) -> str:
    for line in text.split('\n'):
        line = line.strip()
        if line and 2 <= len(line.split()) <= 5 and len(line) < 60 and not re.search(r'[@|•/:]', line):
            return line
    return "Unknown"

def estimate_exp(text: str) -> float:
    years = sorted(set(int(y) for y in re.findall(r'(20\d{2})', text)))
    return round((years[-1]-years[0])/1.0, 1) if len(years) >= 2 else 0.0

async def parse_resume(content: bytes, filename: str) -> ParsedResume:
    text = ""
    if filename.endswith(".pdf"):
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                text = "\n".join(p.extract_text() or "" for p in pdf.pages)
        except ImportError:
            from pypdf import PdfReader
            text = "\n".join(p.extract_text() for p in PdfReader(io.BytesIO(content)).pages)
    elif filename.endswith(".docx"):
        from docx import Document
        text = "\n".join(p.text for p in Document(io.BytesIO(content)).paragraphs)
    return ParsedResume(
        name=extract_name(text), email=extract_email(text), phone=extract_phone(text),
        skills=extract_skills(text), experience_years=estimate_exp(text), raw_text=text[:5000],
    )
