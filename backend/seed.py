import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# --- This finds the directory where seed.py is actually sitting ---
BASE_DIR = Path(__file__).resolve().parent
env_path = BASE_DIR / ".env"

# --- Load the .env using the absolute path ---
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL")

async def seed_database():
    print(f"Connecting to: {MONGODB_URL}")
    if not MONGODB_URL:
        print("ERROR: Still can't find MONGODB_URL in .env")
        return
    client = AsyncIOMotorClient(MONGODB_URL)
    
    # --- Naming my database "ecommerce_db" and the collection "products" ---
    db = client.ecommerce_db
    collection = db.products

    # --- Realistic Amazon product data ---
    sample_products = [
        {
            "id": 1, 
            "name": "Echo Dot (5th Gen)", 
            "price": 49.99, 
            "category": "Electronics", 
            "image": "https://m.media-amazon.com/images/I/71C3oN9OVML._AC_SL1000_.jpg", 
            "description": "Smart speaker with Alexa. Vibrant sound and helpful voice control."
        },
        {
            "id": 2, 
            "name": "Kindle Paperwhite", 
            "price": 139.99, 
            "category": "Electronics", 
            "image": "https://m.media-amazon.com/images/I/71p1A3JebFL._AC_SL1500_.jpg", 
            "description": "8 GB, now with a 6.8-inch display and adjustable warm light."
        },
        {
            "id": 3, 
            "name": "Sony WH-1000XM5", 
            "price": 348.00, 
            "category": "Electronics", 
            "image": "https://m.media-amazon.com/images/I/61vJtKulIwL._AC_SL1500_.jpg", 
            "description": "Wireless Industry Leading Noise Canceling Headphones."
        },
        {
            "id": 4, 
            "name": "Logitech MX Master 3S", 
            "price": 99.99, 
            "category": "Accessories", 
            "image": "https://m.media-amazon.com/images/I/61xRiwX3eYL._AC_SL1500_.jpg", 
            "description": "Advanced Wireless Mouse, Ultra-fast Scrolling, Ergonomic."
        },
        {
            "id": 5, 
            "name": "Hydro Flask Water Bottle", 
            "price": 44.95, 
            "category": "Home", 
            "image": "https://m.media-amazon.com/images/I/51A2k6F5K3L._AC_SL1500_.jpg", 
            "description": "Stainless Steel Reusable Water Bottle - Wide Mouth with Flex Cap."
        }
    ]

    # --- Delete old data to prevent duplicates ---
    await collection.delete_many({})
    
    # --- Insert the new products ---
    result = await collection.insert_many(sample_products)
    print(f"Success! Inserted {len(result.inserted_ids)} products into the cloud database.")

    # --- Close connection ---
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())