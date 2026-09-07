from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .database import engine, Base
from .models.user import User
from .models.resume import Resume
from .models.analysis import Analysis
from app.routers import auth, resume
from app.config import SECRET_KEY, FRONTEND_URL

Base.metadata.create_all(bind=engine)

app = FastAPI(title = "AI Resume Analyzer")

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)

@app.get('/')
def root():
    return {"message": "AI Resume Analyzer"}