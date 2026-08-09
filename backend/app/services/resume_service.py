import os
from uuid import uuid4
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.user import User
from app.config import UPLOAD_DIRECTORY
from pathlib import Path
from app.services.pdf_service import extract_text_from_pdf
from app.services.redis_service import delete_reviews_for_resume

UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)

def upload_resume(file: UploadFile, current_user: User, db: Session) -> Resume:
    if not file.filename:
        raise ValueError("No file was uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are allowed.")
    
    original_file_name = file.filename
    
    # Generate a unique filename to avoid collisions
    stored_file_name = f"{uuid4()}.pdf"
    
    stored_file_path = UPLOAD_DIRECTORY/stored_file_name
    
    #Now The uploaded file is currently in RAM (temporary memory).
    # Save it permanently to disk inside the uploads directory.
    with open(stored_file_path, "wb") as buffer:
        buffer.write(file.file.read())      # read()-reads the entire PDF as bytes.
    
    # database operation
    try:
        active_resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
        
        if active_resume:
            active_resume.is_active = False
            
        new_resume = Resume(user_id=current_user.id,
                            original_file_name=original_file_name,
                            file_path=str(stored_file_path),
                            is_active=True)

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)
    
        return new_resume

    # if file is saved in disk, but if database crashes, then the data won't be saved in the Postgres database. Hence rollback
    except Exception:
        db.rollback()
        
        # if the file exists, then delete it
        if stored_file_path.exists():
            os.remove(stored_file_path)
        
        raise
    
def get_resume_text(resume: Resume) -> str:
    pdf_path = Path(resume.file_path)
    
    return extract_text_from_pdf(pdf_path)

# below function is used when we want to download, analyze,
# delete or preview the resume (it will give back the active resume)
def get_active_resume(current_user: User, db: Session) -> Resume:
    resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()

    if resume is None:
        raise ValueError("No active resume found.")
    
    return resume

def delete_resume(resume_id: int, current_user: User, db: Session):
    # finding the resume belonging to the current user
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )
    
    if not resume:
        raise ValueError("Resume not found.")
    
    # remember whether the resume being deleted is active
    was_active = resume.is_active
    
    # save the file path before deleting the database object
    file_path = Path(resume.file_path)
    
    db.delete(resume)
    
    # if the deleted resume was active, make the latest resume active
    if was_active:
        # query for finding another resume, excluding the one we're deleting.
        another_resume = (
            db.query(Resume)
            .filter(Resume.user_id == current_user.id, Resume.id != resume_id)
            .order_by(Resume.uploaded_at.desc())
            .first()
        )
        
        if another_resume:
            another_resume.is_active = True
            
    db.commit()
    
    # delete the physical file after successfull database operation
    if file_path.exists():
        os.remove(file_path)
    
    # Deleting all Redis reviews for this specific resume
    delete_reviews_for_resume(resume_id)