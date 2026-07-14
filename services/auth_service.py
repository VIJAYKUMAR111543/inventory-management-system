from sqlalchemy.orm import Session

import database_models

from security import (
    hash_password,
    verify_password,
    create_access_token
)

from config import DEFAULT_ADMIN

from models import UserCreate


# ======================================================
# Create Default Admin
# ======================================================

def create_default_admin(db: Session):

    admin = db.query(database_models.User).filter(
        database_models.User.email == DEFAULT_ADMIN["email"]
    ).first()

    if admin:
        return

    admin = database_models.User(
        username=DEFAULT_ADMIN["username"],
        email=DEFAULT_ADMIN["email"],
        hashed_password=hash_password(
            DEFAULT_ADMIN["password"]
        ),
        role=DEFAULT_ADMIN["role"],
        is_active=True
    )

    db.add(admin)
    db.commit()


# ======================================================
# Authenticate User
# ======================================================

def authenticate_user(
    email: str,
    password: str,
    db: Session
):

    user = db.query(database_models.User).filter(
        database_models.User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password
    ):
        return None

    return user


# ======================================================
# Generate JWT Token
# ======================================================

def generate_token(user):

    return create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )


# ======================================================
# Find User By Email
# ======================================================

def get_user_by_email(
    email: str,
    db: Session
):

    return db.query(database_models.User).filter(
        database_models.User.email == email
    ).first()


# ======================================================
# Create Employee
# ======================================================

def create_user(
    user: UserCreate,
    db: Session
):

    existing_user = db.query(
        database_models.User
    ).filter(
        database_models.User.email == user.email
    ).first()

    if existing_user:

        return None

    new_user = database_models.User(

        username=user.username,

        email=user.email,

        hashed_password=hash_password(
            user.password
        ),

        role=user.role,

        is_active=True

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


# ======================================================
# Get All Users
# ======================================================

def get_all_users(
    db: Session
):

    return db.query(
        database_models.User
    ).order_by(
        database_models.User.id
    ).all()


# ======================================================
# Get User By ID
# ======================================================

def get_user_by_id(
    user_id: int,
    db: Session
):

    return db.query(
        database_models.User
    ).filter(
        database_models.User.id == user_id
    ).first()

# ======================================================
# Update User
# ======================================================

def update_user(
    user_id: int,
    user_data,
    db: Session
):

    user = get_user_by_id(user_id, db)

    if not user:
        return None

    existing = db.query(database_models.User).filter(
        database_models.User.email == user_data.email,
        database_models.User.id != user_id
    ).first()

    if existing:
        return "EMAIL_EXISTS"

    user.username = user_data.username
    user.email = user_data.email
    user.role = user_data.role
    user.is_active = user_data.is_active

    db.commit()
    db.refresh(user)

    return user


# ======================================================
# Delete User
# ======================================================

def delete_user(
    user_id: int,
    current_user,
    db: Session
):

    if current_user.id == user_id:

        return "SELF_DELETE_NOT_ALLOWED"

    user = get_user_by_id(user_id, db)

    if not user:
        return None

    if user.role == "ADMIN":

        return "ADMIN_DELETE_NOT_ALLOWED"

    db.delete(user)

    db.commit()

    return True


# ======================================================
# Update User Status
# ======================================================
def update_user_status(
    user_id: int,
    is_active: bool,
    current_user,
    db: Session
):

    if current_user.id == user_id:

        return "SELF_STATUS_NOT_ALLOWED"

    user = get_user_by_id(user_id, db)

    if not user:
        return None

    user.is_active = is_active

    db.commit()

    db.refresh(user)

    return user
# ======================================================
# Change Password
# ======================================================

def change_password(
    current_user,
    password_data,
    db: Session
):

    if not verify_password(
        password_data.current_password,
        current_user.hashed_password
    ):
        return "INVALID_PASSWORD"

    current_user.hashed_password = hash_password(
        password_data.new_password
    )

    db.commit()

    db.refresh(current_user)

    return current_user