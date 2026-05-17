# CatVision AI Dashboard

AI-powered video analysis platform that detects cats in uploaded videos using YOLOv8 and displays timestamped detections in a modern dashboard.

## Live Demo
Frontend: https://catvisiondashboard.vercel.app  
Backend API: https://newcat-9aso.onrender.com

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy
- SQLite

### AI / Computer Vision
- OpenCV
- YOLOv8 (Ultralytics)

## Features
- Video upload support
- Real-time processing status
- Cat detection using YOLOv8
- Timestamp-based analysis
- Responsive dashboard UI
- Background video processing

## Project Architecture

Frontend (Vercel)
↓
FastAPI Backend (Render)
↓
YOLOv8 + OpenCV Processing
↓
SQLite Database

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


## Features
- **Video Upload**: Validates max length (60s) and max size (50MB).
- **Background Processing**: Video processing runs asynchronously via FastAPI `BackgroundTasks`.
- **YOLOv8 Inference**: Detects cats using a lightweight, highly efficient model.
- **Dynamic Dashboard**: Views real-time status (pending, processing, completed, failed) and confident frame detections.
- **Video Playback**: Serves uploaded videos statically to view directly alongside results.
