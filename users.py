from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from dependencies import (
    get_db,
    require_admin,
    get_current_active_user
)

from models import (
    UserCreate,
    UserUpdate,
    UserResponse,
    ChangePassword
)

from services.auth_service import (
    create_user,
    get_all_users,
    update_user,
    delete_user,
    update_user_status,
    change_password
)

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)


# =====================================================
# Create Employee
# =====================================================

@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def create_employee(
    user: UserCreate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    new_user = create_user(
        user,
        db
    )

    if new_user is None:

        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    return new_user


# =====================================================
# Get All Users
# =====================================================

@router.get(
    "",
    response_model=list[UserResponse]
)
def get_users(
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    return get_all_users(db)

# =====================================================
# Update User
# =====================================================

@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def edit_user(
    user_id: int,
    user: UserUpdate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    updated = update_user(
        user_id,
        user,
        db
    )

    if updated is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if updated == "EMAIL_EXISTS":

        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    return updated


# =====================================================
# Delete User
# =====================================================

@router.delete(
    "/{user_id}"
)
def remove_user(
    user_id: int,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    deleted = delete_user(
        user_id,
        current_user,
        db
    )

    if deleted is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    
    if deleted == "SELF_DELETE_NOT_ALLOWED":

        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account."
        )

    if deleted == "ADMIN_DELETE_NOT_ALLOWED":

        raise HTTPException(
            status_code=400,
            detail="Admin account cannot be deleted."
        )

    return {
        "message": "User deleted successfully."
    }


# =====================================================
# Activate / Deactivate User
# =====================================================

@router.patch(
    "/{user_id}/status",
    response_model=UserResponse
)
def change_status(
    user_id: int,
    is_active: bool,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    user = update_user_status(
    user_id,
    is_active,
    current_user,
    db
)

    if user == "SELF_STATUS_NOT_ALLOWED":

        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account."
        )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return user

# =====================================================
# Change Password
# =====================================================

@router.put(
    "/me/change-password"
)
def update_password(
    password: ChangePassword,
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):

    result = change_password(
        current_user,
        password,
        db
    )

    if result == "INVALID_PASSWORD":

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect."
        )

    return {
        "message": "Password changed successfully."
    }