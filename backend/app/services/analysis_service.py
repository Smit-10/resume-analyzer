from pathlib import Path
from sqlalchemy.orm import Session
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.services.pdf_service import extract_text_from_pdf
from app.services.text_cleaner import clean_text

def analyze_resume(resume: Resume, db: Session):
    pdf_path = Path(resume.file_path)
    raw_text = extract_text_from_pdf(pdf_path)
    
    cleaned_text = clean_text(raw_text)
    
    return cleaned_text