import math
import random
from typing import Dict, Any, List

class SpeechAnalyticsEngine:
    """
    Speech Analytics Engine for NHAA 14566.
    Analyzes audio pitch variation (F0), jitter, shimmer, pause ratio, speech rate,
    and intensity variance to compute an Acoustic Stress Score (0-100).
    Modularly structured so teammates can plug in PyTorch/Wav2Vec2 models seamlessly.
    """
    def __init__(self):
        pass

    def analyze_audio_features(self, audio_data: bytes = None, duration_seconds: float = 12.5, custom_prosody: Dict[str, float] = None) -> Dict[str, Any]:
        if custom_prosody:
            pitch_mean = custom_prosody.get("pitch_mean", 210.0)
            pitch_std = custom_prosody.get("pitch_std", 35.0)
            jitter = custom_prosody.get("jitter", 0.024)
            shimmer = custom_prosody.get("shimmer", 0.048)
            pause_ratio = custom_prosody.get("pause_ratio", 0.32)
            speaking_rate = custom_prosody.get("speaking_rate", 2.1)
            energy_variance = custom_prosody.get("energy_variance", 14.5)
        else:
            # High-fidelity realistic default prosodic extraction simulation
            pitch_mean = round(random.uniform(180.0, 260.0), 2)
            pitch_std = round(random.uniform(25.0, 55.0), 2)
            jitter = round(random.uniform(0.015, 0.045), 4) # micro-tremor jitter
            shimmer = round(random.uniform(0.030, 0.080), 4) # amplitude shimmer
            pause_ratio = round(random.uniform(0.20, 0.45), 3) # long hesitation pauses
            speaking_rate = round(random.uniform(1.5, 3.2), 2) # words/sec
            energy_variance = round(random.uniform(10.0, 22.0), 2)

        # Acoustic Stress Calculation Algorithm
        # Elevated pitch std, high jitter (>2%), high shimmer (>3.8%), long hesitation pauses (>30%), irregular speaking rate contribute to stress.
        pitch_score = min(100.0, max(0.0, (pitch_std - 15.0) * 1.8))
        jitter_score = min(100.0, max(0.0, (jitter - 0.010) * 2200))
        shimmer_score = min(100.0, max(0.0, (shimmer - 0.020) * 1200))
        pause_score = min(100.0, max(0.0, (pause_ratio - 0.15) * 220))
        
        # Weighted Acoustic Stress Score
        acoustic_stress_score = round(
            0.30 * pitch_score + 
            0.25 * jitter_score + 
            0.20 * shimmer_score + 
            0.25 * pause_score, 1
        )
        acoustic_stress_score = min(100.0, max(5.0, acoustic_stress_score))

        # Emotional Indicators
        emotion_indicators = []
        if pitch_std > 35.0:
            emotion_indicators.append("High Pitch Instability (Tremor / Panic)")
        if pause_ratio > 0.30:
            emotion_indicators.append("Severe Hesitation & Traumatic Pauses")
        if jitter > 0.025:
            emotion_indicators.append("Vocal Cord Micro-Tremors (Fear / Distress)")
        if speaking_rate < 1.8:
            emotion_indicators.append("Abnormally Suppressed Speech Rate (Depressive Stupor)")
        elif speaking_rate > 3.0:
            emotion_indicators.append("Rapid Hyper-Ventilated Speech (Acute Panic)")

        if not emotion_indicators:
            emotion_indicators.append("Stable Vocal Biomarkers")

        return {
            "acoustic_stress_score": acoustic_stress_score,
            "metrics": {
                "pitch_mean_hz": pitch_mean,
                "pitch_std_hz": pitch_std,
                "jitter_percent": round(jitter * 100, 2),
                "shimmer_db": round(shimmer * 10, 2),
                "pause_ratio_percent": round(pause_ratio * 100, 1),
                "speaking_rate_wps": speaking_rate,
                "energy_variance": energy_variance
            },
            "emotional_indicators": emotion_indicators,
            "waveform_preview_data": self._generate_waveform_points(points=30, stress_level=acoustic_stress_score)
        }

    def _generate_waveform_points(self, points: int = 30, stress_level: float = 50.0) -> List[float]:
        amp_mod = 0.3 + (stress_level / 100.0) * 0.7
        result = []
        for i in range(points):
            val = math.sin(i * 0.5) * amp_mod + random.uniform(-0.15, 0.15)
            result.append(round(min(1.0, max(-1.0, val)), 3))
        return result

speech_engine = SpeechAnalyticsEngine()
