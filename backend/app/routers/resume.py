from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeUploadResponse
from app.auth.jwt_handler import get_current_user
from app.services.resume_service import upload_resume

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