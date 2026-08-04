from fastapi import FastAPI
from .database import engine, Base
from .models.user import User
from .models.resume import Resume
from .models.analysis import Analysis
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title = "AI Resume Analyzer")

app.include_router(auth.router)

@app.get('/')
def root():
    return {"message": "AI Resume Analyzer"}