from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)# server_default is used when Postgres will give default value like timestamp.Hence, for is_active we are using 'default' only
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    user = relationship("User", back_populates="resumes")
    
    # uselist = False tells that as it is one-to-one relation, do not give back list when asked resume.analysis because by default it returns a list of object
    analysis = relationship("Analysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")