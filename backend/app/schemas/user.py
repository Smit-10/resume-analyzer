from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime

# Input provided by User
class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

# Data user will get back in response
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    # from_attributes: Pydantic changes its behavior. Instead of expecting a dictionary,it says: "I'll read the object's attributes."
    # In simple, Allows Pydantic to read data from SQLAlchemy model objects instead of expecting a dictionary.
    model_config = ConfigDict(from_attributes=True)  # using because we return "sqlalchemy model" in api route, but response model is a "Pydantic model"