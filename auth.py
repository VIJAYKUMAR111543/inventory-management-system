from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from dependencies import (
    get_db,
    get_current_active_user
)

from models import (
    Token,
    UserResponse
)

from services.auth_service import (
    authenticate_user,
    generate_token
)

import database_models

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =====================================================
# Login
# =====================================================

@router.post(
    "/login",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        form_data.username,
        form_data.password,
        db
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    access_token = generate_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =====================================================
# Current Logged In User
# =====================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def current_user(
    current_user: database_models.User = Depends(
        get_current_active_user
    )
):

    return current_user