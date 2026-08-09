from pydantic import BaseModel

class ResumeReviewResponse(BaseModel):
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    final_recommendation: str