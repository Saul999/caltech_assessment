from fastapi import FastAPI, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId  
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


@app.on_event("startup")
async def startup_db():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017/caltech")
    app.mongodb = app.mongodb_client.caltech  

@app.on_event("startup")
async def set_collection():
    global collection
    collection = app.mongodb.get_collection("astro")

@app.on_event("shutdown")
async def shutdown_db():
    app.mongodb_client.close()

class Item(BaseModel):
    rb: Optional[float] = None
    drb: Optional[float] = None
    galactic_latitude: Optional[int] = None
    jd: Optional[float] = None
    jdstarthist: Optional[float] = None

    class Config:
        json_encoders = {ObjectId: str}

@app.get("/items/", response_model=List[Item])
async def get_items():
    items_cursor = collection.find({}, {"_id": 0, "rb": 1, "drb": 1, "galactic_latitude": 1, "jd": 1, "jdstarthist": 1})
    items = []
    async for item in items_cursor:
        items.append(item)
    return items

#add and/or filter
@app.get("/filter/", response_model=List[Item])
async def get_filter(
    rb: Optional[float] = Query(None),
    drb: Optional[float] = Query(None),
    galactic_latitude: Optional[int] = Query(None),
    jd: Optional[float] = Query(None),
    jdstarthist: Optional[float] = Query(None),
):
    query = {}
    if rb is not None:
        query["rb"] = rb
    if drb is not None:
        query["drb"] = drb
    if galactic_latitude is not None:
        query["galactic_latitude"] = galactic_latitude
    if jd is not None:
        query["jd"] = jd
    if jdstarthist is not None:
        query["jdstarthist"] = jdstarthist

    items_cursor = collection.find(query, {"_id": 0, "rb": 1, "drb": 1, "galactic_latitude": 1, "jd": 1, "jdstarthist": 1})
    items = []
    async for item in items_cursor:
        items.append(item)
    return items
