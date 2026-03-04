from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# --- Load the secret URL from the .env file ---
load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")

app = FastAPI()

# --- CORS Middleware for React (Phase 3 ready!) ---
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