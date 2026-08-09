from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ExtractedTextResponse(BaseModel):
    extracted_text: str

# below schema for frontend analysis history
class ResumeAnalysisResponse(BaseModel):
    similarity_score: float
    skill_match_score: float
    overall_score: float
    resume_skills: list[str]
    job_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]

# schema for analysis table
class AnalysisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    resume_id: int
    job_description: str
    score: float
    matched_skills: list[str]
    missing_skills: list[str]
    created_at: datetime

# for getting the history of analysis for previous resumes uploaded by user
class AnalysisHistoryResponse(BaseModel):
    analyses: list[AnalysisResponse]