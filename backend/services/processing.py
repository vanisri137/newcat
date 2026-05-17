import cv2
import os
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from ultralytics import YOLO

try:
    # Use YOLOv8 nano model for speed
    model = YOLO("yolov8n.pt")
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None


def process_video(video_id: int):
    db = SessionLocal()
    cap = None

    try:
        video = db.query(models.Video).filter(models.Video.id == video_id).first()

        if not video:
            return

        video.status = "processing"
        db.commit()

        cap = cv2.VideoCapture(video.filepath)

        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)

        if fps <= 0:
            video.status = "failed"
            db.commit()
            return

        duration = total_frames / fps
        video.duration = duration

        # Max duration limit
        if duration > 60:
            video.status = "failed"
            db.commit()
            cap.release()
            return

        # Process roughly 1 frame per second
        frame_interval = int(round(fps * 3))

        if frame_interval <= 0:
            frame_interval = 1

        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            if frame_idx % frame_interval == 0:
                timestamp = frame_idx / fps

                cat_present = False
                max_conf = 0.0

                if model:
                    # Resize frame to reduce memory usage
                    frame = cv2.resize(frame, (640, 360))

                    results = model(frame, verbose=False)

                    # COCO class 15 = cat
                    for r in results:
                        boxes = r.boxes

                        for box in boxes:
                            cls_id = int(box.cls[0])
                            conf = float(box.conf[0])

                            if cls_id == 15 and conf > 0.4:
                                cat_present = True

                                if conf > max_conf:
                                    max_conf = conf

                prediction = models.FramePrediction(
                    video_id=video.id,
                    timestamp=timestamp,
                    cat_present=cat_present,
                    confidence=max_conf if cat_present else None
                )

                db.add(prediction)

            frame_idx += 1

        video.status = "completed"
        db.commit()

    except Exception as e:
        print(f"Processing failed for video {video_id}: {e}")

        if 'video' in locals() and video:
            video.status = "failed"
            db.commit()

    finally:
        if cap:
            cap.release()

        cv2.destroyAllWindows()
        db.close()
       
