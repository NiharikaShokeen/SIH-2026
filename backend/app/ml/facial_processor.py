"""
app/ml/facial_processor.py

Facial expression / distress signal processor.

Design notes (read before wiring this into svi_engine.py):
- This detects EXPRESSION (fear, sadness, anger, pain-adjacent grimacing),
  not literal injuries. Do not present this as "injury detection" — that
  is a different CV task with much heavier consent/dignity implications.
- Weighted lowest of all modalities in fusion (see integration snippet
  at the bottom) because facial expression recognition is the least
  reliable and most demographically biased of the three signal types.
- Expects a SINGLE frame (snapshot), not a continuous video stream —
  matches the "no raw media retained" privacy design. The frame bytes
  are processed in-memory and discarded immediately after scoring.
"""

from dataclasses import dataclass, field
from typing import Optional
import numpy as np

try:
    import cv2
    OPENCV_OK = True
except ImportError:
    OPENCV_OK = False

try:
    from fer import FER
    FER_OK = True
except ImportError:
    FER_OK = False


# FACS-informed heuristic: emotions most associated with acute distress/pain
DISTRESS_EMOTIONS = ("fear", "sad", "angry", "disgust")

# Weight for the "critical" escalation path — deliberately conservative.
# fear + a high disgust/anger combo (associated with pain grimacing in
# FACS literature) pushes toward critical faster than sadness alone.
PAIN_PROXY_EMOTIONS = ("fear", "disgust")


@dataclass
class FacialResult:
    score: float                  # 0-100 distress sub-score
    dominant_emotion: Optional[str]
    emotion_breakdown: dict
    pain_proxy_flag: bool         # heuristic "possible pain/acute distress" flag
    reasons: list = field(default_factory=list)
    modality_available: bool = True


class FacialProcessor:
    def __init__(self):
        self._detector = FER(mtcnn=True) if FER_OK else None
        self._cascade = None
        if OPENCV_OK and not FER_OK:
            self._cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            )
            if self._cascade.empty():
                self._cascade = None

    def process_frame(self, image_bytes: bytes) -> FacialResult:
        if not OPENCV_OK:
            return FacialResult(
                score=0, dominant_emotion=None, emotion_breakdown={},
                pain_proxy_flag=False, reasons=["opencv not installed"],
                modality_available=False,
            )

        arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return FacialResult(
                score=0, dominant_emotion=None, emotion_breakdown={},
                pain_proxy_flag=False, reasons=["could not decode frame"],
                modality_available=False,
            )

        # --- No emotion model available: report faces found but don't score ---
        if not FER_OK:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = self._cascade.detectMultiScale(gray, 1.1, 5) if self._cascade else []
            if len(faces) == 0:
                return FacialResult(
                    score=0, dominant_emotion=None, emotion_breakdown={},
                    pain_proxy_flag=False,
                    reasons=[
                        "face detector unavailable"
                        if self._cascade is None
                        else "no face detected"
                    ],
                    modality_available=self._cascade is not None,
                )
            return FacialResult(
                score=0, dominant_emotion=None, emotion_breakdown={},
                pain_proxy_flag=False,
                reasons=["face detected; emotion model (fer) not installed"],
                modality_available=False,
            )

        # --- Real scoring path ---
        result = self._detector.detect_emotions(img)
        if not result:
            return FacialResult(
                score=0, dominant_emotion=None, emotion_breakdown={},
                pain_proxy_flag=False, reasons=["no face detected"],
            )

        emotions = result[0]["emotions"]
        distress_weight = sum(emotions.get(e, 0) for e in DISTRESS_EMOTIONS)
        pain_weight = sum(emotions.get(e, 0) for e in PAIN_PROXY_EMOTIONS)

        dominant = max(emotions, key=emotions.get)
        score = min(distress_weight * 100, 100)
        pain_flag = pain_weight > 0.55  # conservative threshold, tune with real data

        reasons = [f"dominant expression: {dominant} ({emotions[dominant]*100:.0f}%)"]
        if pain_flag:
            reasons.append("pain-adjacent expression pattern detected (fear/disgust combo)")

        return FacialResult(
            score=score,
            dominant_emotion=dominant,
            emotion_breakdown=emotions,
            pain_proxy_flag=pain_flag,
            reasons=reasons,
        )

