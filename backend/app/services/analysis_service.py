from pathlib import Path
from sqlalchemy.orm import Session
from app.models.analysis import Analysis
from app.models.resume import Resume
from app.models.user import User
from app.services.pdf_service import extract_text_from_pdf
from app.services.text_cleaner import clean_text
from app.services.nlp_service import preprocess_for_tfidf, calculate_similarity
from app.services.skill_service import extract_skills

def analyze_resume(resume: Resume, job_description: str, db: Session):
    pdf_path = Path(resume.file_path)
    
    raw_text = extract_text_from_pdf(pdf_path)
    
    cleaned_text = clean_text(raw_text)
    
    # tfidf + cosine similarity
    processed_resume = preprocess_for_tfidf(cleaned_text)
    
    processed_job_description = preprocess_for_tfidf(job_description)
    
    similarity_score = calculate_similarity(processed_resume, processed_job_description)
    
    # skill extraction
    resume_skills = extract_skills(cleaned_text)
    
    job_skills = extract_skills(job_description)
    
    # checks for value common in both, resume and job description
    matched_skills = list(set(resume_skills) & set(job_skills))
    
    missing_skills = list(set(job_skills) - set(resume_skills))
    
    if job_skills:
        skill_match_score = len(matched_skills) / len(job_skills)
    else:
        skill_match_score = 0.0
        
    overall_score = (similarity_score * 0.30) + (skill_match_score * 0.70)
    
    analysis = Analysis(
        resume_id=resume.id,
        job_description=job_description,
        score=overall_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills
    )
    
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return{
        "similarity_score": similarity_score,
        "skill_match_score": skill_match_score,
        "overall_score": overall_score,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }