from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.token import Token
from app.services.auth_service import register_user, login_user
from app.auth.jwt_handler import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(user_data, db)
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", status_code=status.HTTP_200_OK)
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user_data = UserLogin(
            email = form_data.username,
            password = form_data.password
        )
        token = login_user(user_data, db)
        
        response.set_cookie(
            key="access_token",
            value=token.access_token,
            httponly=True,
            secure=False,   # make it True when using HTTPS
            samesite="lax",
            max_age=60*60
        )
        
        return {
            "message": "Login successful"
        }
    
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )
    
    return {"message": "Logout successfull"}