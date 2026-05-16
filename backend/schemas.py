from pydantic import BaseModel
from typing import List, Optional

class FramePredictionBase(BaseModel):
    timestamp: float
    cat_present: bool
    confidence: Optional[float] = None

class FramePrediction(FramePredictionBase):
    id: int
    video_id: int
    class Config:
        from_attributes = True

class VideoBase(BaseModel):
    filename: str

class VideoUploadResponse(VideoBase):
    id: int
    status: str
    class Config:
        from_attributes = True

class Video(VideoBase):
    id: int
    filepath: str
    duration: Optional[float] = None
    status: str
    
    class Config:
        from_attributes = True

class VideoWithPredictions(Video):
    predictions: List[FramePrediction] = []
