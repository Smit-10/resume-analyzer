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