# 🐱 CatVision AI Dashboard

An AI-powered video analysis platform that detects cats in uploaded videos using **YOLOv8**, extracts timestamped detections with confidence scores, and presents results through a modern, responsive web dashboard.

The application enables users to upload short videos, automatically analyze them using computer vision, and view the exact timestamps where cats are detected.

---

## 🚀 Live Deployment

### Frontend

Deployed on **Vercel**

### Backend

Deployed on **Hugging Face Spaces** using **FastAPI** and **Docker**

---

## ✨ Features

* Upload videos up to **50 MB** and **60 seconds**
* AI-powered cat detection using **YOLOv8**
* Timestamp-based detection results
* Detection confidence scores
* Background video processing
* Real-time processing status updates
* Video playback alongside analysis results
* Responsive and user-friendly dashboard
* Cloud deployment with Vercel and Hugging Face Spaces

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS
* Axios

### Backend

* FastAPI
* SQLAlchemy
* SQLite

### Computer Vision

* OpenCV
* YOLOv8 (Ultralytics)

### Deployment

* Vercel
* Hugging Face Spaces
* Docker

---

## 🏗️ System Architecture

```text
User Uploads Video
        │
        ▼
Next.js Frontend (Vercel)
        │
        ▼
FastAPI Backend (Hugging Face Spaces)
        │
        ▼
YOLOv8 + OpenCV Processing
        │
        ▼
SQLite Database
        │
        ▼
Timestamped Cat Detection Results
```

## 🔄 Workflow

1. User uploads a video through the dashboard.
2. Video metadata is stored in the database.
3. FastAPI starts background processing.
4. OpenCV extracts video frames.
5. YOLOv8 analyzes frames and detects cats.
6. Detection timestamps and confidence scores are stored.
7. Results are displayed on the dashboard.
8. Users can view detected timestamps and confidence levels.

---

## 📂 Project Structure

```text
newcat/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routers/
│   ├── services/
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚡ Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd newcat
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend will run at:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

---

## 🎯 Key Functionalities

### Video Upload Validation

* Maximum video size: 50 MB
* Maximum video duration: 60 seconds

### Background Processing

* Uses FastAPI BackgroundTasks
* Prevents UI blocking during analysis

### YOLOv8 Inference

* Detects cats using YOLOv8 Nano
* Optimized for fast processing

### Timestamp Analysis

* Extracts detection timestamps
* Stores confidence scores
* Displays results in chronological order

### Video Playback

* Allows users to watch uploaded videos
* View detections alongside playback

---

## 📈 Future Improvements

* Multi-animal detection support
* User authentication
* Detection heatmaps
* Export analysis reports
* Cloud database integration (PostgreSQL)
* Advanced analytics dashboard

---

## 👨‍💻 Author

**Nandyala Vani **

AI/ML Enthusiast | Full Stack Developer

---

## 📄 License

This project is intended for educational, research, and portfolio purposes.

