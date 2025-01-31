from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
from bson import ObjectId  # <-- Import ObjectId from bson


app = FastAPI()

# MongoDB connection
@app.on_event("startup")
async def startup_db():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017/caltech")
    app.mongodb = app.mongodb_client.caltech  # Connect to the 'caltech' database

# Make sure collection is set after MongoDB connection
@app.on_event("startup")
async def set_collection():
    global collection
    collection = app.mongodb.get_collection("astro")

@app.on_event("shutdown")
async def shutdown_db():
    app.mongodb_client.close()

# Define Pydantic model to match the database structure
class Item(BaseModel):
    rb: float
    drb: float
    galactic_latitude: int
    jd: float
    jdstarthist: float

    class Config:
        # Allow ObjectId conversion to string when returning data
        json_encoders = {
            ObjectId: str
        }

# Define route to get items with selected fields
@app.get("/items/", response_model=List[Item])
async def get_items():
    # Retrieve only specific fields from the MongoDB collection
    items_cursor = collection.find({}, {"_id": 0, "rb": 1, "drb": 1, "galactic_latitude": 1, "jd": 1, "jdstarthist": 1})
    items = []
    async for item in items_cursor:
        items.append(item)
    return items
