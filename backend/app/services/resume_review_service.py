from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.user import User
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

def get_resume_review_by_analysis(analysis_id: int, current_user: User, db: Session) -> dict:
    
    # finding the analysis and make sure it belongs to the currently logged-in user
    analysis = (
        db.query(Analysis)
        .join(Analysis.resume)
        .filter(Analysis.id == analysis_id, Analysis.resume.has(user_id=current_user.id))
        .first()
    )
    
    if not analysis:
        raise ValueError("Analysis not found.")
    
    # getting the resume associated with this analysis
    resume = analysis.resume
    
    if resume is None:
        raise ValueError("Resume associated with this analysis was not found.")
    
    job_description = analysis.job_description
    
    return get_resume_review(resume=resume, job_description=job_description, db=db)