from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    filepath = Column(String)
    duration = Column(Float, nullable=True) # duration in seconds
    status = Column(String, default="pending") # pending, processing, completed, failed
    
    predictions = relationship("FramePrediction", back_populates="video", cascade="all, delete-orphan")

class FramePrediction(Base):
    __tablename__ = "frame_predictions"
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    timestamp = Column(Float, index=True) # timestamp in seconds
    cat_present = Column(Boolean, default=False)
    confidence = Column(Float, nullable=True)
    
    video = relationship("Video", back_populates="predictions")
