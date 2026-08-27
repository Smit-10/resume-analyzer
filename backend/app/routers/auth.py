from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.token import Token
from app.services.auth_service import register_user, login_user, google_login_user
from app.auth.jwt_handler import get_current_user, create_access_token
from app.models.user import User
from app.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Google OAuth configuration
oauth = OAuth()

oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
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

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )
    
    return {"message": "Logout successfull"}

# Google login
@router.get("/google")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(
        request,
        GOOGLE_REDIRECT_URI    
    )

# Google callback
@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        # Exchange authorization code for Google tokens
        token = await oauth.google.authorize_access_token(request)
        
        # Get user information from Google
        user_info = token.get("userinfo")
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to get user information from Google."
            )
        
        google_id = user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name")
        
        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google account information is incomplete"
            )
        
        # find or create a user
        user = google_login_user(
            google_id=google_id,
            email=email,
            name=name,
            db=db
        )
        
        # creating our existing JWT
        access_token = create_access_token(
            {
                "sub": str(user.id)
            }
        )
        
        # Redirect back to React
        response = RedirectResponse(
            url="http://127.0.0.1:5173/dashboard",
            status_code=status.HTTP_302_FOUND
        )
        
        # storing JWT in the same cookie used by normal login
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60*60
        )
        
        return response
    
    except Exception as e:
        print("Google Auth Error: ", e)
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google authentication failed."
        )


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user