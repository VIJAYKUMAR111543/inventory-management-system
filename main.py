from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from database import SessionLocal, engine
from database_models import Base
import database_models
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

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
    Product(id=1, name="Phone", description="budget Phone", price=99, quantity=10),
    Product(id=2, name="Laptop", description="gaming laptop", price=999, quantity=5),
    Product(id=3, name="Tablet", description="10-inch tablet", price=199, quantity=15),
    Product(id=4, name="Watch", description="smart watch", price=199, quantity=20),
]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = SessionLocal()

    count = db.query(database_models.Product).count()

    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
    db.close()
init_db()
@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    return db.query(database_models.Product).all()

@app.get("/product/{id}")
def get_product_by_id(id: int,db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        return db_product
    return {"message": "Product not found"}

@app.post("/products")
def add_product(product: Product,db: Session = Depends(get_db)):
    db_product = database_models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    return db_product

@app.put("/products")
def update_product(id:int,product:Product,db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return product
    else:
        return "No product found"

@app.delete("/products")
def delete_product(id: int,db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        
    else:
        return "product not found"
