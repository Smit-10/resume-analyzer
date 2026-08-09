from fastapi import APIRouter, Depends, Form, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeUploadResponse
from app.auth.jwt_handler import get_current_user
from app.schemas.analysis import ExtractedTextResponse, ResumeAnalysisResponse, AnalysisResponse, AnalysisHistoryResponse
from app.services.analysis_history_service import get_analysis_history, get_analysis_by_id
from app.services.analysis_service import analyze_resume
from app.services.resume_service import upload_resume, get_resume_text, get_active_resume, delete_resume
from app.services.resume_review_service import get_resume_review
from app.schemas.resume_review import ResumeReviewResponse
from app.exceptions.llm_exceptions import LLMResponseError, LLMServiceError

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

# UploadFile = File (...) means multipart/form-data
@router.post("/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
def upload(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return upload_resume(file=file, current_user=current_user, db=db)
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/extract-text", response_model=ExtractedTextResponse, status_code=status.HTTP_200_OK)
def extract_text(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        resume = get_active_resume(current_user=current_user, db=db)
        
        # extract the text from active resume
        extracted_text = get_resume_text(resume)
        
        return ExtractedTextResponse(extracted_text=extracted_text)
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume_endpoint(job_description: str = Form(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        active_resume = get_active_resume(current_user=current_user, db=db)
        result = analyze_resume(resume=active_resume, job_description=job_description, db=db)
        
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/analyses", response_model=AnalysisHistoryResponse)
def analysis_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analyses = get_analysis_history(current_user=current_user, db=db)
    
    return AnalysisHistoryResponse(analyses=analyses)

@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def analysis_details(analysis_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        analysis = get_analysis_by_id(analysis_id=analysis_id, current_user=current_user, db=db)
        return analysis
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# deleting resume
@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume_endpoint(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        delete_resume(resume_id=resume_id, current_user=current_user, db=db)
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# Resume Review using LLM
@router.post("/review", response_model=ResumeReviewResponse)
def resume_review(job_description: str = Form(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # getting users active resume
        active_resume = get_active_resume(current_user=current_user, db=db)
        
        # generate or retrieve review
        review = get_resume_review(resume=active_resume, job_description=job_description, db=db)
        
        return review
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    except LLMServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="Resume review service is temporarily unavailable. Please try again later."
        )
    
    except LLMResponseError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI service returned an invalid response. Please try again."
        )