from pydantic import BaseModel, EmailStr


# ==========================================
# Product Model
# ==========================================

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int
    category: str

    class Config:
        from_attributes = True


# ==========================================
# User Registration Model
# ==========================================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "EMPLOYEE"


# ==========================================
# User Update Model
# ==========================================

class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    role: str
    is_active: bool


# ==========================================
# Change Password Model
# ==========================================

class ChangePassword(BaseModel):
    current_password: str
    new_password: str


# ==========================================
# Reset Password Model (Admin)
# ==========================================

class ResetPassword(BaseModel):
    new_password: str


# ==========================================
# Change Password
# ==========================================

class ChangePassword(BaseModel):
    current_password: str
    new_password: str


# ==========================================
# User Login Model
# ==========================================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# JWT Token Response
# ==========================================

class Token(BaseModel):
    access_token: str
    token_type: str


# ==========================================
# Token Data
# ==========================================

class TokenData(BaseModel):
    email: str | None = None


# ==========================================
# User Response
# ==========================================

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True