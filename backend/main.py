import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from routers import videos

# Create DB tables
models.Base.metadata.create_all(bind=engine)

# Create uploads dir
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Video Analysis Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(videos.router, prefix="/api/videos", tags=["videos"])

@app.get("/")
def read_root():
    return {"message": "Video Analysis API"}
