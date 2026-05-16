import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import database
import models
import schemas
from services.processing import process_video

router = APIRouter()

@router.post("/upload", response_model=schemas.VideoUploadResponse)
def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    if not file.filename.endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    file_location = f"uploads/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Validate size constraint: max 50MB
    file_size_mb = os.path.getsize(file_location) / (1024 * 1024)
    if file_size_mb > 50:
        os.remove(file_location)
        raise HTTPException(status_code=400, detail="File too large. Maximum 50MB limit.")

    db_video = models.Video(filename=file.filename, filepath=file_location)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)

    # Enqueue background processing
    background_tasks.add_task(process_video, db_video.id)

    return db_video

@router.get("/", response_model=list[schemas.Video])
def list_videos(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    videos = db.query(models.Video).order_by(models.Video.id.desc()).offset(skip).limit(limit).all()
    return videos

@router.get("/{video_id}", response_model=schemas.VideoWithPredictions)
def get_video(video_id: int, db: Session = Depends(database.get_db)):
    video = db.query(models.Video).filter(models.Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
