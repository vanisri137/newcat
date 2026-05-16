# CatVision AI - Video Analysis Dashboard

A full-stack, end-to-end video analysis platform capable of accepting video uploads, background processing them via computer vision (YOLOv8), and rendering timestamps of cat detections within an elegant Next.js dashboard.

## Architecture Overview

* **Frontend**: Next.js 14, React, Tailwind CSS. Implements a responsive, clean dashboard to upload and view video analysis results with real-time status polling.
* **Backend**: FastAPI (Python), SQLite, SQLAlchemy. Robust API handling file uploads, managing video metadata, and serving static video files for playback.
* **Video Processing Pipeline**: Background processing task utilizing OpenCV for frame extraction (1 FPS) and Ultralytics YOLOv8 nano for rapid, accurate object detection (specifically filtering for the "cat" class).
* **Storage**: Local persistence in the `/backend/uploads` directory.
* **Database**: SQLite (local) to store `Video`, `ProcessingJob`, and timestamped `FramePrediction` records.

## Setup Instructions

### Prerequisites
* Node.js (v18+)
* Python (3.9+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy opencv-python ultralytics python-multipart
   ```
4. Run the development server (runs on `http://localhost:8000`):
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features
- **Video Upload**: Validates max length (60s) and max size (50MB).
- **Background Processing**: Video processing runs asynchronously via FastAPI `BackgroundTasks`.
- **YOLOv8 Inference**: Detects cats using a lightweight, highly efficient model.
- **Dynamic Dashboard**: Views real-time status (pending, processing, completed, failed) and confident frame detections.
- **Video Playback**: Serves uploaded videos statically to view directly alongside results.
