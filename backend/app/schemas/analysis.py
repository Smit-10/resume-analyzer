from pydantic import BaseModel

class ExtractedTextResponse(BaseModel):
    extracted_text: str