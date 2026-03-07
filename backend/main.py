from fastapi import FastAPI, status, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import os

# --- Pydantic model for CartItem ---
class CartItem(BaseModel):
    product_id: int
    name: str
    price: float = Field(gt=0, description="Price must be positive") 
    image: str
    # --- Prevent negative numbers and zero ---
    quantity: int = Field(default=1, gt=0, description="Quantity must be at least 1")

# --- Load the secret URL from the .env file ---
load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")

app = FastAPI()

# --- CORS Middleware for React ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Connect to Database when the app starts ---
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    app.database = app.mongodb_client.ecommerce_db
    print("Connected to the MongoDB database!")

# --- Disconnect when the app shuts down ---
@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

@app.get("/")
def home():
    return {"message": "API and Database connection ready!"}

# --- ADD THIS NEW ROUTE BELOW ---

@app.get("/products")
async def get_products():
    # --- 1. Access the 'products' collection ---
    collection = app.database.products
    
    # --- 2. Fetch all products (limit to 100) ---
    products = await collection.find().to_list(100)
    
    # --- 3. Clean up the MongoDB '_id' so the browser can read it ---
    for product in products:
        product["_id"] = str(product["_id"])
        
    return products

# --- PHASE 2: CART CRUD OPERATIONS ---
# --- 1. CREATE: Add to Cart ---
# --- Status.HTTP_201_CREATED professionally connects the frontend as well as to indicate a successful creation of a new cart item ---
@app.post("/cart", status_code=status.HTTP_201_CREATED)
async def add_to_cart(item: CartItem):
    # --- Look up the OFFICIAL product details from my 'products' collection ---
    # --- This prevents manual typos from ruining the data integrity ---
    official_product = await app.database.products.find_one({"id": item.product_id})
    
    # --- If the product ID doesn't exist, stop right here ---
    if not official_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This product ID does not exist in our store!"
        )

    cart_collection = app.database.cart
    
    # --- Check if the product is already in the cart ---
    existing_item = await cart_collection.find_one({"product_id": item.product_id})
    
    if existing_item:
        # --- Update quantity if item exists ---
        new_quantity = existing_item["quantity"] + item.quantity
        await cart_collection.update_one(
            {"product_id": item.product_id},
            {"$set": {"quantity": new_quantity}}
        )
        return {"message": f"Updated {official_product['name']} quantity to {new_quantity}!"}
    
    # --- Create new entry using OFFICIAL data from the database ---
    new_cart_entry = {
        "product_id": official_product["id"],
        "name": official_product["name"],
        "price": official_product["price"],
        "image": official_product["image"],
        "quantity": item.quantity
    }
    
    await cart_collection.insert_one(new_cart_entry)
    return {"message": f"Successfully added {official_product['name']} to the cart!"}

# --- 2. READ: Get Cart API ---
# --- Fetches all items currently stored in the cart collection ---
@app.get("/cart")
async def get_cart():
    cart_collection = app.database.cart
    # --- Retrieve all items (limited to 100 for performance/safety) ---
    items = await cart_collection.find().to_list(100)
    
    # --- Clean up MongoDB _id for React frontend compatibility ---
    for item in items:
        item["_id"] = str(item["_id"])
    return items

# --- 3. UPDATE: Change Quantity API ---
# --- We use Query(gt=0) to ensure the user can't set a quantity of 0 or less ---
@app.put("/cart/{product_id}")
async def update_cart_quantity(product_id: int, quantity: int = Query(gt=0)):
    cart_collection = app.database.cart
    
    result = await cart_collection.update_one(
        {"product_id": product_id},
        {"$set": {"quantity": quantity}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found in cart"
        )
        
    return {"message": "Quantity updated successfully"}

# --- 4. DELETE: Remove from Cart API ---
# --- Completely removes a specific product from the cart collection ---
@app.delete("/cart/{product_id}")
async def delete_from_cart(product_id: int):
    cart_collection = app.database.cart
    result = await cart_collection.delete_one({"product_id": product_id})
    
    # --- Beyond the Rubric: Validate that a deletion actually occurred ---
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found in cart"
        )
        
    return {"message": "Item removed from cart"}