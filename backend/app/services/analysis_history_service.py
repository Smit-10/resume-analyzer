from sqlalchemy.orm import Session
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisResponse

def get_analysis_history(current_user: User, db: Session):
    analyses = (
        db.query(Analysis)
        .join(Analysis.resume)
        .filter(Analysis.resume.has(user_id=current_user.id))
        .order_by(Analysis.created_at.desc())
        .all()
    )
    
    # above query returns list of object not a dict, hence first 
    result =  []
    for analysis in analyses:
        #model_validate- Take this SQLAlchemy object and create an 
        # AnalysisResponse(pydantic model) from its attributes.
        # result.append(AnalysisResponse.model_validate(analysis))
        result.append(
            AnalysisResponse(
                id=analysis.id,
                resume_id=analysis.resume_id,
                original_file_name=analysis.resume.original_file_name,
                job_description=analysis.job_description,
                score=analysis.score,
                matched_skills=analysis.matched_skills,
                missing_skills=analysis.missing_skills,
                created_at=analysis.created_at
            )
        )
    
    return result

def get_analysis_by_id(analysis_id: int, current_user: User, db: Session):
    analysis = (
        db.query(Analysis)
        .join(Analysis.resume)
        .filter(Analysis.id == analysis_id, Analysis.resume.has(user_id=current_user.id))
        .first()
    )
    
    if not analysis:
        raise ValueError("Analysis not found.")
    
    return AnalysisResponse(
        id=analysis.id,
        resume_id=analysis.resume_id,
        original_file_name=analysis.resume.original_file_name,
        job_description=analysis.job_description,
        score=analysis.score,
        matched_skills=analysis.matched_skills,
        missing_skills=analysis.missing_skills,
        created_at=analysis.created_at
    )