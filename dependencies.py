from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import SessionLocal
import database_models
from config import SECRET_KEY, ALGORITHM


# ======================================================
# Database Dependency
# ======================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================================================
# OAuth2 Scheme
# ======================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ======================================================
# Get Current User
# ======================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(database_models.User).filter(
        database_models.User.email == email
    ).first()

    if user is None:
        raise credentials_exception

    return user


# ======================================================
# Get Active User
# ======================================================

def get_current_active_user(
    current_user: database_models.User = Depends(get_current_user)
):

    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user."
        )

    return current_user


# ======================================================
# Admin Only
# ======================================================

def require_admin(
    current_user: database_models.User = Depends(
        get_current_active_user
    )
):

    if current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

    return current_user


# ======================================================
# Employee or Admin
# ======================================================

def require_employee_or_admin(
    current_user: database_models.User = Depends(
        get_current_active_user
    )
):

    if current_user.role.upper() not in [
        "ADMIN",
        "EMPLOYEE"
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied."
        )

    return current_user