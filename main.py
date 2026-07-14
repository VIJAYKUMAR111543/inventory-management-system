from email.mime import image

from auth import router as auth_router

from fastapi import FastAPI, Depends,UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from database import SessionLocal, engine
from database_models import Base
import database_models
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from users import router as users_router
import os
import shutil
from dependencies import (
     get_db,
     require_admin,
     require_employee_or_admin,
 )

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods =["*"]
)

@app.get("/")
def greet():
    db = SessionLocal()
    db.query()
    return "Hello from the frontend!"

products = [
    Product(
        id=1,
        name="Phone",
        description="budget Phone",
        price=99,
        quantity=10,
        category="Electronics"
    ),
    Product(
        id=2,
        name="Laptop",
        description="gaming laptop",
        price=999,
        quantity=5,
        category="Electronics"
    ),
    Product(
        id=3,
        name="Tablet",
        description="10-inch tablet",
        price=199,
        quantity=15,
        category="Electronics"
    ),
    Product(
        id=4,
        name="Watch",
        description="smart watch",
        price=199,
        quantity=20,
        category="Electronics"
    ),
]


def init_db():
    db = SessionLocal()

    count = db.query(database_models.Product).count()

    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
    db.close()
init_db()

from services.auth_service import create_default_admin

db = SessionLocal()
create_default_admin(db)
db.close()

@app.get("/products")

def get_all_products(
    current_user=Depends(require_employee_or_admin),
    db: Session = Depends(get_db)
):
    return db.query(database_models.Product).all()

@app.get("/product/{id}")

def get_product_by_id(
    id: int,
    current_user=Depends(require_employee_or_admin),
    db: Session = Depends(get_db)
):
    product = db.query(database_models.Product).filter(
        database_models.Product.id == id
    ).first()

    if not product:
        return {"message": "Product not found"}

    return product

@app.post("/products")
async def add_product(
    id: int = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
    
):
    image_path = None

    if image:

        MAX_FILE_SIZE = 2 * 1024 * 1024

        image.file.seek(0, 2)
        file_size = image.file.tell()
        image.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            return {
                "message": "Image size must be less than 2 MB."
            }

        allowed_extensions = [".jpg", ".jpeg", ".png", ".pjpeg", ".jfif"]

        file_extension = os.path.splitext(image.filename)[1].lower()

        if file_extension not in allowed_extensions:
            return {
                "message": "Only JPG, JPEG, PNG and JFIF images are allowed."
            }

        filename = f"{id}_{image.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_path = filename

    db_product = database_models.Product(
        id=id,
        name=name,
        description=description,
        price=price,
        quantity=quantity,
        category=category,
        image=image_path
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product

@app.put("/products")
async def update_product(
    id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    category: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id
    ).first()

    if not db_product:
        return {"message": "Product not found"}

    db_product.name = name
    db_product.description = description
    db_product.price = price
    db_product.quantity = quantity
    db_product.category = category

    if image:

        MAX_FILE_SIZE = 2 * 1024 * 1024

        image.file.seek(0, 2)
        file_size = image.file.tell()
        image.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            return {
                "message": "Image size must be less than 2 MB."
            }

        allowed_extensions = [".jpg", ".jpeg", ".png", ".pjpeg", ".jfif"]

        file_extension = os.path.splitext(image.filename)[1].lower()

        if file_extension not in allowed_extensions:
            return {
                "message": "Only JPG, JPEG, PNG and JFIF images are allowed."
            }

        if db_product.image:

            old_image_path = os.path.join(
                UPLOAD_FOLDER,
                db_product.image
            )

            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        filename = f"{id}_{image.filename}"
        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        db_product.image = filename

    db.commit()
    db.refresh(db_product)

    return db_product

@app.delete("/products")

def delete_product(
    id: int,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id
    ).first()

    if not db_product:
        return {"message": "Product not found"}

    if db_product.image:

        image_path = os.path.join(
            UPLOAD_FOLDER,
            db_product.image
        )

        if os.path.exists(image_path):
            os.remove(image_path)

    db.delete(db_product)
    db.commit()

    return {"message": "Product deleted successfully"}