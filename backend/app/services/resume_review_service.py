from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.resume_service import get_resume_text
from app.services.skill_service import extract_skills
from app.services.redis_service import create_review_cache_key, save_review, get_review
from app.services.llm_review_service import generate_resume_review

def get_resume_review(resume: Resume, job_description: str, db: Session) -> dict:
    
    # Validating job description
    if not job_description or not job_description.strip():
        raise ValueError("Job description cannot be empty.")
    
    # extracting complete resume text
    resume_text = get_resume_text(resume) 
    
    # Validating extracted resume content
    if not resume_text or not resume_text.strip():
        raise ValueError("The uploaded resume does not contain readable text.")
    
    # extracting skills from job description
    job_skills = extract_skills(job_description)
    
    # generating redis cache key
    redis_key = create_review_cache_key(resume_id=resume.id, job_skills=job_skills)
    
    # check redis
    cached_review = get_review(redis_key)
    if cached_review is not None:
        print("CACHE HIT")
        print(f"Redis key: {redis_key}")
        return cached_review

    # Cache MISS
    print("CACHE MISS")
    print(f"Redis Key: {redis_key}")
    # LLM receives the complete resume and complete job description
    review = generate_resume_review(resume_text=resume_text, job_description=job_description)
    
    # saving the LLM response in Redis
    save_review(key=redis_key, review=review)
    
    return review