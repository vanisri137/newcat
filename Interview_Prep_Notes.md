# Video Analysis Dashboard - Senior Interview Preparation Guide

*This document is designed to help you ace your internship interview. It prepares you to talk about your architectural decisions like a Senior Full-Stack Engineer.*

---

## 1. High-Level Architecture Overview

**How it works:**
1. **Upload Phase**: The user uploads a video via the Next.js frontend. The frontend validates the 50MB limit to save bandwidth, then posts it to the FastAPI backend.
2. **Acceptance Phase**: FastAPI saves the file to local storage, logs a `Video` and `ProcessingJob` row into SQLite marking it as `"pending"`, and **immediately returns** a 200 OK to the frontend without waiting for the video to process. 
3. **Background Processing Phase**: FastAPI hands the video path over to a `BackgroundTasks` thread. OpenCV decodes the video frame-by-frame (skipping frames to achieve 1 FPS). Each extracted frame is passed through the YOLOv8 Object Detection model.
4. **Data Persistence**: When a frame yields a "cat" bounding box with >40% confidence, a `FramePrediction` row is stored in SQLite with its timestamp. Finally, the job status is marked `"completed"`.
5. **Dashboard Polling**: The Next.js frontend, which has been polling the API every 3 seconds, sees the status flip to `"completed"` and immediately pulls down the timestamps to render the UI.

---

## 2. Tech Stack: "Why did you choose this?"

As an engineer, you must always justify your tools. Here is how you explain yours:

### A. Next.js (React)
* **What it is:** A React framework that handles routing, server-side rendering, and tooling out-of-the-box.
* **Why this instead of Plain React?** Setting up plain React (create-react-app or Vite) means you have to manually configure routers (react-router) and deal with complex bundling. Next.js App Router gives you file-system routing instantly and enforces clean, production-ready structure.
* **Why this instead of Angular/Vue?** React is the industry standard and has the best ecosystem for rapid UI development (like `lucide-react` for icons and `axios` handling). 

### B. FastAPI (Python)
* **What it is:** A modern, incredibly fast Python web framework.
* **Why this instead of Express.js (Node)?** While Node.js is great for web APIs, **Python is the undisputed king of AI and Machine Learning**. Integrating complex libraries like PyTorch, OpenCV, and Ultralytics (YOLO) directly inside a Node.js Express server is exceedingly difficult and often requires messy microservices. By making the backend in Python, the API and the AI live together in perfect harmony.
* **Why this instead of Django/Flask?** FastAPI is infinitely faster, natively asynchronous (which is vital for handling slow video uploads), and automatically generates API documentation (Swagger UI).

### C. SQLite (Database)
* **What it is:** A lightweight, file-based SQL database.
* **Why this instead of PostgreSQL?** For an internship assignment, the reviewers need to be able to clone and run your project with zero friction. If you used Postgres, the reviewer would be forced to download a Postgres server, configure a port, and setup a user/password locally just to test your code. SQLite perfectly satisfies the "SQL" requirement while requiring **zero configuration**.

### D. YOLOv8 & OpenCV (Processing Pipeline)
* **What it is:** YOLO (You Only Look Once) is an open-source real-time object detection model. OpenCV is a computer vision library used to manipulate the video file.
* **Why this instead of Google Vision API / Roboflow?** Google Vision requires registering credit cards, battling billing limits, and injecting secret `.env` API keys. By embedding the incredibly lightweight YOLOv8n (nano) model natively inside the backend, the project is 100% free, has absolutely zero network-latency, and works offline. It is a flex of strong self-contained engineering.

---

## 3. Potential Interview Questions & Exceptional Answers

Expect the interviewers to probe "what if" scenarios to test your scalability knowledge.

**Q1: How do you prevent the video processing from freezing the backend so other users can still use the website?**
> **Senior Answer:** "Video processing is extremely CPU-heavy. If I processed the video in the main API request, the entire server would block, and it would eventually timeout. Instead, I offloaded the intensive OpenCV/YOLO code into a FastAPI `BackgroundTasks` function. This releases the main thread immediately so the database can respond 'pending' to the user, while the video computes silently in the background."

**Q2: We noticed the frontend uses "long-polling" (setInterval) to check when the video is done. Is there a better way?**
> **Senior Answer:** "Yes. For this mini-project, polling every 3 seconds is lightweight and reliable. However, in a production environment with millions of users, polling blasts the server with empty `GET` requests. A more scalable approach would be to implement **WebSockets** or **Server-Sent Events (SSE)**. That way, the server pushes exactly one notification to the frontend the microsecond the video finishes."

**Q3: How are you managing large video files? What if a user uploads a 5GB 4K Video?**
> **Senior Answer:** "I implemented dual-layer validation. First, the Frontend React component checks the `file.size` and blocks uploads over 50MB—which saves the user's bandwidth. Secondly, the Backend checks the file size before committing it to storage to strictly enforce the constraint. Furthermore, the video is processed chunk-by-chunk using OpenCV's `VideoCapture` generator, meaning we don't load a massive video file entirely into RAM."

**Q4: Why did you only process 1 frame per second? Why not check all 30 frames every second?**
> **Senior Answer:** "Computational efficiency. Processing 30 frames a second through a Neural Network for a 60-second video means running 1,800 inferences. The amount of visual information that changes between frame 1 and frame 2 in a 30fps video is minuscule. By sampling exactly 1 frame per second, we drop inference computations down from 1,800 to just 60, achieving massive speed gains without actually losing any reasonable timestamp accuracy."

**Q5: If we launched this to 10,000 global users tomorrow, what would crash first and how would you fix it?**
> **Senior Answer:** "The background threadpool on the single ASGI (FastAPI) server would bottleneck immediately as 10,000 YOLO instances try to run on one CPU. To fix this, I would decouple the architecture: I'd use **Celery & Redis (or RabbitMQ)**. The FastAPI server would just drop the video into an AWS S3 bucket and put a message on a Redis Queue. Then, a dedicated cluster of GPU-optimized Worker Servers would pull from the queue, run the AI, and update the database. This allows us to scale the Web Servers and the ML Workers independently."
