from datetime import timedelta

# ==========================================
# JWT Configuration
# ==========================================

SECRET_KEY = "Vijay_Inventory_Management_System_2026_Secure_Key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

ACCESS_TOKEN_EXPIRE = timedelta(
    minutes=ACCESS_TOKEN_EXPIRE_MINUTES
)

# ==========================================
# Default Admin
# ==========================================

DEFAULT_ADMIN = {
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "admin123",
    "role": "ADMIN"
}