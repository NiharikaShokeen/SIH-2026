import math
import subprocess
import tempfile
import os
from typing import Dict, Any, List

import numpy as np
try:
    import librosa
except Exception:
    librosa = None


class SpeechAnalyticsEngine:
    """
    Speech Analytics Engine for NHAA 14566.

    Extracts acoustic features from an uploaded audio recording:

    - Mean pitch (F0)
    - Pitch variation
    - Jitter approximation
    - Shimmer approximation
    - Pause ratio
    - Speech rate estimate
    - Energy variation

    These features are combined into an Acoustic Stress Score (0-100).

    NOTE:
    This is an engineering prototype for acoustic feature analysis.
    It is NOT a clinically validated stress/trauma diagnostic system.
    """

    def __init__(self):
        self.sample_rate = 16000

    # ============================================================
    # MAIN ANALYSIS FUNCTION
    # ============================================================

    def analyze_audio_features(
        self,
        audio_data: bytes = None,
        duration_seconds: float = None,
        custom_prosody: Dict[str, float] = None
    ) -> Dict[str, Any]:

        # --------------------------------------------------------
        # Custom values are retained for compatibility with
        # the existing /assess endpoint.
        # --------------------------------------------------------

        if custom_prosody:
            return self._analyze_custom_prosody(custom_prosody)

        if not audio_data or librosa is None:
            return self._analyze_custom_prosody(custom_prosody or self.default_prosody)

        wav_path = None

        try:
            # ----------------------------------------------------
            # 1. Convert browser WebM/Opus -> WAV
            # ----------------------------------------------------

            wav_path = self._convert_to_wav(audio_data)

            # ----------------------------------------------------
            # 2. Load audio
            # ----------------------------------------------------

            y, sr = librosa.load(
                wav_path,
                sr=self.sample_rate,
                mono=True
            )

            if len(y) == 0:
                return self._empty_result(
                    "Audio file contains no usable samples."
                )

            actual_duration = len(y) / sr

            # ----------------------------------------------------
            # 3. Remove extremely small background noise
            # ----------------------------------------------------

            y_trimmed, _ = librosa.effects.trim(
                y,
                top_db=35
            )

            if len(y_trimmed) > 0:
                y_analysis = y_trimmed
            else:
                y_analysis = y

            # ----------------------------------------------------
            # 4. Extract features
            # ----------------------------------------------------

            pitch_mean, pitch_std, pitch_values = (
                self._extract_pitch(y_analysis, sr)
            )

            jitter = self._estimate_jitter(
                pitch_values
            )

            shimmer = self._estimate_shimmer(
                y_analysis,
                sr
            )

            pause_ratio = self._calculate_pause_ratio(
                y,
                sr
            )

            speaking_rate = self._estimate_speech_rate(
                y,
                sr,
                actual_duration
            )

            energy_variance = self._calculate_energy_variance(
                y
            )

            # ----------------------------------------------------
            # 5. Calculate individual stress components
            # ----------------------------------------------------

            pitch_score = self._pitch_stress_score(
                pitch_std
            )

            jitter_score = self._jitter_stress_score(
                jitter
            )

            shimmer_score = self._shimmer_stress_score(
                shimmer
            )

            pause_score = self._pause_stress_score(
                pause_ratio
            )

            rate_score = self._speech_rate_stress_score(
                speaking_rate
            )

            energy_score = self._energy_stress_score(
                energy_variance
            )

            # ----------------------------------------------------
            # 6. Acoustic Stress Score
            #
            # Main features:
            # Pitch variation 25%
            # Jitter          20%
            # Shimmer         15%
            # Pauses          20%
            # Speech rate     10%
            # Energy          10%
            # ----------------------------------------------------

            acoustic_stress_score = round(
                (
                    0.25 * pitch_score
                    + 0.20 * jitter_score
                    + 0.15 * shimmer_score
                    + 0.20 * pause_score
                    + 0.10 * rate_score
                    + 0.10 * energy_score
                ),
                1
            )

            acoustic_stress_score = min(
                100.0,
                max(0.0, acoustic_stress_score)
            )

            # ----------------------------------------------------
            # 7. Emotional/acoustic indicators
            # ----------------------------------------------------

            indicators = self._generate_indicators(
                pitch_std=pitch_std,
                jitter=jitter,
                shimmer=shimmer,
                pause_ratio=pause_ratio,
                speaking_rate=speaking_rate,
                energy_variance=energy_variance
            )

            # ----------------------------------------------------
            # 8. Estimate confidence
            # ----------------------------------------------------

            confidence = self._estimate_confidence(
                duration=actual_duration,
                voiced_frames=len(pitch_values)
            )

            uncertainty = self._get_uncertainty(
                confidence
            )

            # ----------------------------------------------------
            # 9. Waveform data for frontend
            # ----------------------------------------------------

            waveform = self._generate_waveform_points(
                y,
                points=60
            )

            # ----------------------------------------------------
            # 10. Return result
            # ----------------------------------------------------

            return {
                "acoustic_stress_score": acoustic_stress_score,

                "confidence": confidence,

                "uncertainty": uncertainty,

                "duration_seconds": round(
                    actual_duration,
                    2
                ),

                "metrics": {
                    "pitch_mean_hz": round(
                        pitch_mean,
                        2
                    ),

                    "pitch_std_hz": round(
                        pitch_std,
                        2
                    ),

                    "jitter_percent": round(
                        jitter * 100,
                        3
                    ),

                    "shimmer_percent": round(
                        shimmer * 100,
                        3
                    ),

                    "pause_ratio_percent": round(
                        pause_ratio * 100,
                        1
                    ),

                    "speaking_rate_wps": round(
                        speaking_rate,
                        2
                    ),

                    "energy_variance": round(
                        energy_variance,
                        4
                    )
                },

                "emotional_indicators": indicators,

                "waveform_preview_data": waveform
            }

        except Exception as e:

            print(
                "Speech analysis error:",
                repr(e)
            )

            return self._empty_result(
                f"Audio analysis failed: {str(e)}"
            )

        finally:

            # ----------------------------------------------------
            # Delete temporary WAV file
            # ----------------------------------------------------

            if wav_path and os.path.exists(wav_path):

                try:
                    os.remove(wav_path)
                except OSError:
                    pass

    # ============================================================
    # AUDIO CONVERSION
    # ============================================================

    def _convert_to_wav(
        self,
        audio_data: bytes
    ) -> str:

        input_file = tempfile.NamedTemporaryFile(
            suffix=".webm",
            delete=False
        )

        input_path = input_file.name

        try:

            input_file.write(audio_data)
            input_file.close()

            output_file = tempfile.NamedTemporaryFile(
                suffix=".wav",
                delete=False
            )

            output_path = output_file.name
            output_file.close()

            command = [
                "ffmpeg",
                "-y",
                "-i",
                input_path,
                "-ac",
                "1",
                "-ar",
                str(self.sample_rate),
                "-sample_fmt",
                "s16",
                output_path
            ]

            result = subprocess.run(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            if result.returncode != 0:

                raise RuntimeError(
                    "FFmpeg conversion failed: "
                    + result.stderr[-1000:]
                )

            return output_path

        finally:

            if os.path.exists(input_path):

                try:
                    os.remove(input_path)
                except OSError:
                    pass

    # ============================================================
    # PITCH / F0
    # ============================================================

    def _extract_pitch(
        self,
        y: np.ndarray,
        sr: int
    ):

        try:

            f0, voiced_flag, voiced_prob = (
                librosa.pyin(
                    y,
                    fmin=librosa.note_to_hz("C2"),
                    fmax=librosa.note_to_hz("C7"),
                    sr=sr,
                    frame_length=2048,
                    hop_length=256
                )
            )

            valid_pitch = f0[
                np.isfinite(f0)
                & (f0 > 0)
            ]

            if len(valid_pitch) == 0:

                return 0.0, 0.0, []

            pitch_mean = float(
                np.mean(valid_pitch)
            )

            pitch_std = float(
                np.std(valid_pitch)
            )

            return (
                pitch_mean,
                pitch_std,
                valid_pitch.tolist()
            )

        except Exception as e:

            print(
                "Pitch extraction warning:",
                repr(e)
            )

            return 0.0, 0.0, []

    # ============================================================
    # JITTER
    # ============================================================

    def _estimate_jitter(
        self,
        pitch_values: List[float]
    ) -> float:

        if len(pitch_values) < 3:
            return 0.0

        pitch = np.asarray(
            pitch_values,
            dtype=float
        )

        # Approximate period from F0
        periods = 1.0 / pitch

        period_differences = np.abs(
            np.diff(periods)
        )

        mean_period = np.mean(
            periods
        )

        if mean_period <= 0:
            return 0.0

        jitter = (
            np.mean(period_differences)
            / mean_period
        )

        return float(
            np.clip(jitter, 0.0, 0.10)
        )

    # ============================================================
    # SHIMMER
    # ============================================================

    def _estimate_shimmer(
        self,
        y: np.ndarray,
        sr: int
    ) -> float:

        try:

            frame_length = 1024
            hop_length = 256

            rms = librosa.feature.rms(
                y=y,
                frame_length=frame_length,
                hop_length=hop_length
            )[0]

            rms = rms[
                rms > np.percentile(rms, 20)
            ]

            if len(rms) < 3:
                return 0.0

            amplitude_differences = np.abs(
                np.diff(rms)
            )

            mean_amplitude = np.mean(
                rms
            )

            if mean_amplitude <= 0:
                return 0.0

            shimmer = (
                np.mean(amplitude_differences)
                / mean_amplitude
            )

            return float(
                np.clip(shimmer, 0.0, 0.20)
            )

        except Exception:

            return 0.0

    # ============================================================
    # PAUSE DETECTION
    # ============================================================

    def _calculate_pause_ratio(
        self,
        y: np.ndarray,
        sr: int
    ) -> float:

        if len(y) == 0:
            return 1.0

        intervals = librosa.effects.split(
            y,
            top_db=35
        )

        voiced_samples = sum(
            end - start
            for start, end in intervals
        )

        voiced_ratio = (
            voiced_samples
            / len(y)
        )

        pause_ratio = 1.0 - voiced_ratio

        return float(
            np.clip(
                pause_ratio,
                0.0,
                1.0
            )
        )

    # ============================================================
    # SPEECH RATE
    # ============================================================

    def _estimate_speech_rate(
        self,
        y: np.ndarray,
        sr: int,
        duration: float
    ) -> float:

        if duration <= 0:
            return 0.0

        try:

            # Estimate syllable-like peaks from amplitude envelope

            envelope = librosa.feature.rms(
                y=y,
                frame_length=1024,
                hop_length=256
            )[0]

            if len(envelope) < 3:
                return 0.0

            threshold = np.mean(envelope) * 0.8

            active = envelope > threshold

            transitions = np.diff(
                active.astype(int)
            )

            starts = np.where(
                transitions == 1
            )[0]

            speech_segments = len(starts)

            # Approximate syllables/second
            rate = (
                speech_segments * 1.5
            ) / duration

            return float(
                np.clip(
                    rate,
                    0.2,
                    6.0
                )
            )

        except Exception:

            return 0.0

    # ============================================================
    # ENERGY VARIANCE
    # ============================================================

    def _calculate_energy_variance(
        self,
        y: np.ndarray
    ) -> float:

        rms = librosa.feature.rms(
            y=y,
            frame_length=1024,
            hop_length=256
        )[0]

        if len(rms) == 0:
            return 0.0

        return float(
            np.var(rms)
        )

    # ============================================================
    # STRESS SCORING
    # ============================================================

    def _pitch_stress_score(
        self,
        pitch_std: float
    ) -> float:

        # Higher pitch variability -> higher score

        return float(
            np.clip(
                (pitch_std - 15.0) * 1.8,
                0,
                100
            )
        )

    def _jitter_stress_score(
        self,
        jitter: float
    ) -> float:

        return float(
            np.clip(
                (jitter - 0.005) * 1800,
                0,
                100
            )
        )

    def _shimmer_stress_score(
        self,
        shimmer: float
    ) -> float:

        return float(
            np.clip(
                (shimmer - 0.02) * 600,
                0,
                100
            )
        )

    def _pause_stress_score(
        self,
        pause_ratio: float
    ) -> float:

        return float(
            np.clip(
                (pause_ratio - 0.10) * 130,
                0,
                100
            )
        )

    def _speech_rate_stress_score(
        self,
        speaking_rate: float
    ) -> float:

        # Normal prototype range:
        # approximately 1.5 - 3.5 words/sec

        if speaking_rate < 1.5:

            score = (
                1.5 - speaking_rate
            ) * 60

        elif speaking_rate > 3.5:

            score = (
                speaking_rate - 3.5
            ) * 50

        else:

            score = 0

        return float(
            np.clip(
                score,
                0,
                100
            )
        )

    def _energy_stress_score(
        self,
        energy_variance: float
    ) -> float:

        # This is intentionally a relatively weak component.

        return float(
            np.clip(
                energy_variance * 2500,
                0,
                100
            )
        )

    # ============================================================
    # INDICATORS
    # ============================================================

    def _generate_indicators(
        self,
        pitch_std: float,
        jitter: float,
        shimmer: float,
        pause_ratio: float,
        speaking_rate: float,
        energy_variance: float
    ) -> List[str]:

        indicators = []

        if pitch_std > 35:

            indicators.append(
                "High Pitch Variability"
            )

        elif pitch_std > 20:

            indicators.append(
                "Moderate Pitch Variability"
            )

        if jitter > 0.025:

            indicators.append(
                "Elevated Vocal Period Irregularity"
            )

        if shimmer > 0.05:

            indicators.append(
                "Elevated Amplitude Variation"
            )

        if pause_ratio > 0.35:

            indicators.append(
                "High Pause / Silence Ratio"
            )

        elif pause_ratio > 0.20:

            indicators.append(
                "Moderate Pause Ratio"
            )

        if speaking_rate < 1.5:

            indicators.append(
                "Slow Speech Rate"
            )

        elif speaking_rate > 3.5:

            indicators.append(
                "Rapid Speech Rate"
            )

        if not indicators:

            indicators.append(
                "No Strong Acoustic Irregularities Detected"
            )

        return indicators

    # ============================================================
    # CONFIDENCE
    # ============================================================

    def _estimate_confidence(
        self,
        duration: float,
        voiced_frames: int
    ) -> float:

        confidence = 50.0

        if duration >= 5:
            confidence += 15

        if duration >= 10:
            confidence += 10

        if duration >= 20:
            confidence += 5

        if voiced_frames >= 20:
            confidence += 10

        if voiced_frames >= 50:
            confidence += 10

        return round(
            min(95.0, confidence),
            1
        )

    def _get_uncertainty(
        self,
        confidence: float
    ) -> str:

        if confidence >= 80:
            return "Low"

        if confidence >= 60:
            return "Moderate"

        return "High"

    # ============================================================
    # WAVEFORM
    # ============================================================

    def _generate_waveform_points(
        self,
        y: np.ndarray,
        points: int = 60
    ) -> List[float]:

        if len(y) == 0:
            return [0.0] * points

        indices = np.linspace(
            0,
            len(y),
            points + 1
        ).astype(int)

        result = []

        for i in range(points):

            start = indices[i]
            end = indices[i + 1]

            segment = y[start:end]

            if len(segment) == 0:
                result.append(0.0)
                continue

            value = np.max(
                np.abs(segment)
            )

            result.append(
                round(
                    float(
                        np.clip(
                            value,
                            0,
                            1
                        )
                    ),
                    3
                )
            )

        return result

    # ============================================================
    # EMPTY / ERROR RESULT
    # ============================================================

    def _empty_result(
        self,
        message: str
    ) -> Dict[str, Any]:

        return {
            "acoustic_stress_score": 0.0,
            "confidence": 0.0,
            "uncertainty": "High",
            "error": message,
            "metrics": {
                "pitch_mean_hz": 0.0,
                "pitch_std_hz": 0.0,
                "jitter_percent": 0.0,
                "shimmer_percent": 0.0,
                "pause_ratio_percent": 100.0,
                "speaking_rate_wps": 0.0,
                "energy_variance": 0.0
            },
            "emotional_indicators": [
                "Insufficient audio for analysis"
            ],
            "waveform_preview_data": []
        }

    # ============================================================
    # CUSTOM PROSODY
    # ============================================================

    def _analyze_custom_prosody(
        self,
        custom_prosody: Dict[str, float]
    ) -> Dict[str, Any]:

        pitch_mean = custom_prosody.get(
            "pitch_mean",
            210.0
        )

        pitch_std = custom_prosody.get(
            "pitch_std",
            35.0
        )

        jitter = custom_prosody.get(
            "jitter",
            0.024
        )

        shimmer = custom_prosody.get(
            "shimmer",
            0.048
        )

        pause_ratio = custom_prosody.get(
            "pause_ratio",
            0.32
        )

        speaking_rate = custom_prosody.get(
            "speaking_rate",
            2.1
        )

        energy_variance = custom_prosody.get(
            "energy_variance",
            0.01
        )

        score = round(
            (
                0.25
                * self._pitch_stress_score(
                    pitch_std
                )
                + 0.20
                * self._jitter_stress_score(
                    jitter
                )
                + 0.15
                * self._shimmer_stress_score(
                    shimmer
                )
                + 0.20
                * self._pause_stress_score(
                    pause_ratio
                )
                + 0.10
                * self._speech_rate_stress_score(
                    speaking_rate
                )
                + 0.10
                * self._energy_stress_score(
                    energy_variance
                )
            ),
            1
        )

        return {
            "acoustic_stress_score": score,
            "confidence": 60.0,
            "uncertainty": "Moderate",
            "metrics": {
                "pitch_mean_hz": pitch_mean,
                "pitch_std_hz": pitch_std,
                "jitter_percent": round(
                    jitter * 100,
                    3
                ),
                "shimmer_percent": round(
                    shimmer * 100,
                    3
                ),
                "pause_ratio_percent": round(
                    pause_ratio * 100,
                    1
                ),
                "speaking_rate_wps": speaking_rate,
                "energy_variance": energy_variance
            },
            "emotional_indicators": [
                "Custom prosody analysis"
            ],
            "waveform_preview_data": []
        }


speech_engine = SpeechAnalyticsEngine()
