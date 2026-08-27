from sqlalchemy.orm import Session
from app.auth.password import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.jwt_handler import create_access_token
from app.schemas.token import Token

def register_user(user_data: UserCreate, db: Session) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
    if existing_user:
        raise ValueError("Email already registered.")
    
    # hash the password
    hashed_password = hash_password(user_data.password)
    new_user = User(name=user_data.name, email=user_data.email, password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)  # refresh - gives the latest version of this row(here it is row of new_user)
        return new_user
    
    except Exception:
        db.rollback()
        raise

def login_user(user_data: UserLogin, db: Session) -> Token:
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise ValueError("Invalid email or password")
    
    if not verify_password(user_data.password, user.password):   # verify_password(plain_pass, hashed_pass)
        raise ValueError("Invalid email or password")
    
    # create_access_token will take a dictionary as input
    access_token = create_access_token({
        "sub": str(user.id)
    })
    
    return Token(access_token=access_token, access_type="bearer")

def google_login_user(google_id: str, email: str, name: str, db: Session) -> User:
    
    # checking whether this google account already exists
    user = (
        db.query(User)
        .filter(User.google_id == google_id)
        .first()
    )
    
    if user:
        return user
    
    # checking whether this email already exists
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    
    if user:
        # if normal account with same email exists,
        # link the google account to this existing user
        if user.google_id is None:
            user.google_id = google_id
            
            db.commit()
            db.refresh(user)
            
            return user
        
        return user
    
    # creating a new google user
    new_user = User(name=name, email=email, password=None, google_id=google_id)
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    except Exception:
        db.rollback()
        raise