from sqlalchemy import Integer, Column, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    
    # NULL for Google Users
    password = Column(String(255), nullable=True)
    
    # Authentication provider
    provider = Column(String(20), nullable=False, default="local")
    
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default = func.now(), nullable=False)
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")