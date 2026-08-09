import json
from pydantic import ValidationError
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.schemas.resume_review import ResumeReviewResponse
from app.exceptions.llm_exceptions import LLMResponseError, LLMServiceError

client = genai.Client(
    api_key=GEMINI_API_KEY
)

def generate_resume_review(resume_text: str, job_description: str) -> dict:
    prompt = f"""
    You are a professional resume analysis assistant.

    Your job is to analyze a user's resume against a job description and
    provide useful, honest, and actionable feedback directly to the user.

    IMPORTANT:
    - This analysis is for PERSONAL USE by the candidate who owns the resume.
    - Do NOT analyze the candidate from an HR, recruiter, or employer perspective.
    - Do NOT talk about whether the candidate should be hired, shortlisted, or screened.
    - Address the user's situation directly using "you" and "your".
    - Explain what the user is doing well, what is missing, and what they can improve.
    - Do not assume that the user has a skill or experience unless it is explicitly
    present in the resume.
    - If a required skill is missing from the resume, clearly mention that it is
    not shown in the resume.
    - Recommendations should be practical and useful for improving the resume
    and preparing for the job.
    - Do not recommend adding a skill to the resume unless the user actually has
    that skill or gains that experience.
    - Be honest. Do not artificially increase the candidate's suitability.

    Return ONLY valid JSON in exactly this structure:

    {{
        "summary": "A concise summary of how well the user's resume matches the job description.",
        "strengths": [
            "Strength of the user's resume relevant to this job.",
            "Another relevant strength."
        ],
        "weaknesses": [
            "A requirement or area that is missing or weak in the user's resume.",
            "Another weakness."
        ],
        "recommendations": [
            "A practical recommendation for improving the resume or preparing for the role.",
            "Another recommendation."
        ],
        "final_recommendation": "A final piece of personalized advice to the user about their resume and this job."
    }}

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
    
    except Exception as e:
        raise LLMServiceError(f"Gemini API request failed: {str(e)}")
    
    # checking whether gemini returned any respone
    if not response.text:
        raise LLMResponseError("Gemini returned an empty response.")
    
    # Converting Gemini JSON text into Python dict
    try:
        review_data = json.loads(response.text)
    
    except json.JSONDecodeError:
        raise LLMResponseError("Gemini returned an invalid JSON response.")
    
    # validating the response using Pydantic
    try:
        validated_review = ResumeReviewResponse.model_validate(review_data)
    
    except ValidationError as e:
        raise LLMResponseError(f"Gemini returned an invalid resume review structure: {e}")
    
    # Converting Pydantic model back to dictionary
    return validated_review.model_dump()