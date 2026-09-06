import os
import tempfile
from uuid import uuid4
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.models.user import User
from pathlib import Path
from app.services.pdf_service import extract_text_from_pdf
from app.services.redis_service import delete_reviews_for_resume
from app.supabase import supabase
from app.config import SUPABASE_STORAGE_BUCKET

BUCKET_NAME = SUPABASE_STORAGE_BUCKET

def upload_resume(file: UploadFile, current_user: User, db: Session) -> Resume:
    if not file.filename:
        raise ValueError("No file was uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are allowed.")
    
    # Maximum allowed file size: 2 MB
    MAX_FILE_SIZE = 2 * 1024 * 1024
    
    # Read only 2 MB + 1 byte.
    # If we receive more than 2 MB, the file is too large.
    file_content = file.file.read(MAX_FILE_SIZE + 1)

    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError("Resume file must be 2 MB or smaller.")
    
    original_file_name = file.filename
    
    # Generate a unique filename to avoid collisions
    stored_file_name = f"{uuid4()}.pdf"
    
    # we will store file inside a folder belonging to user
    # ex. 3/e23fkm-3rpmgs-3116656500.pdf
    storage_path = f"{current_user.id}/{stored_file_name}"
    
    try:
        # uploading pdf to supabase storage
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_content,
            file_options={
                "content-type": "application/pdf",
                "upsert": False
            }
        )
    
    except Exception:
        raise ValueError("Failed to upload resume to storage.")
    
    # database operation
    try:
        active_resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
        
        if active_resume:
            active_resume.is_active = False
            
        new_resume = Resume(user_id=current_user.id,
                            original_file_name=original_file_name,
                            file_path=storage_path,
                            is_active=True)

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)
    
        return new_resume

    # if file is saved in disk, but if database crashes, then the data won't be saved in the Postgres database. Hence rollback
    except Exception:
        db.rollback()
        
        #If the Database operation failed after storage upload
        # Remove the uploaded file so we don't leave an orphan
        try:
            supabase.storage.from_(BUCKET_NAME).remove(
                [storage_path]
            )
        
        except Exception:
            pass
        
        raise
    
def get_resume_text(resume: Resume) -> str:
    
    # downloading the resume from supabase storage temporarily, 
    # extract its text and then delete the temporary local file
    try:
        # downloading the pdf from supabase storage
        pdf_bytes = supabase.storage.from_(BUCKET_NAME).download(resume.file_path)
    
    except Exception:
        raise ValueError("Failed to download resume from storage.")
    
    temp_file_path = None
    try:
        # creating a temporary PDF file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(pdf_bytes)
            temp_file_path = temp_file.name
        
        text = extract_text_from_pdf(Path(temp_file_path))
        
        return text
    
    finally:
        # deleting the temporary local file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# below function is used when we want to download, analyze,
# delete or preview the resume (it will give back the active resume)
def get_active_resume(current_user: User, db: Session) -> Resume:
    resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()

    if resume is None:
        raise ValueError("No active resume found.")
    
    return resume

def get_user_resumes(current_user: User, db: Session) -> list[Resume]:
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )
    
    return resumes

def set_active_resume(resume_id: int, current_user: User, db: Session):
    # Finding the resume belonging to the current user
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )

    if resume is None:
        raise ValueError("Resume not found.")

    # Making every other resume of this user inactive
    db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.id != resume_id
    ).update(
        {Resume.is_active: False},
        synchronize_session=False
    )

    # Making the selected resume active
    resume.is_active = True

    db.commit()
    db.refresh(resume)

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
    
    # remember whether the resume being deleted is active or not (true or false)
    was_active = resume.is_active
    
    # Save the Supabase Storage path before deleting
    storage_path = resume.file_path
    
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
    
    # Deleting PDF from Supabase storage
    try:
        supabase.storage.from_(BUCKET_NAME).remove(
            [storage_path]
        )
    
    except Exception as e:
        print(f"Warning: Failed to delete resume from Supabase Storage: {e}")
    
    # Deleting all Redis reviews for this specific resume
    delete_reviews_for_resume(resume_id)