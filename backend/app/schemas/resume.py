from datetime import datetime
from pydantic import BaseModel, ConfigDict

class ResumeUploadResponse(BaseModel):
    id: int
    original_file_name: str
    uploaded_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)

class ResumeListResponse(BaseModel):
    resumes: list[ResumeUploadResponse]