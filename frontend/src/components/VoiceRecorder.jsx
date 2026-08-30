
import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/v1/analyze/speech";

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      setError("");
      setResult(null);
      setAudioURL(null);
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Stop microphone
        stream.getTracks().forEach((track) => track.stop());

        // Upload audio to backend
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();

      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((previousDuration) => previousDuration + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);

      setError(
        "Could not access your microphone. Please allow microphone permission."
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Upload audio to FastAPI
  const uploadAudio = async (audioBlob) => {
    try {
      setIsAnalyzing(true);
      setError("");

      console.log("================================");
      console.log("ABOUT TO SEND AUDIO TO BACKEND");
      console.log("API URL:", API_URL);
      console.log("Blob size:", audioBlob.size);
      console.log("Blob type:", audioBlob.type);
      console.log("================================");

      const formData = new FormData();

      formData.append("file", audioBlob, "recording.webm");

      console.log("FormData created");
      console.log("Sending POST request...");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      console.log("Backend response received");
      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        throw new Error(errorText || "Speech analysis failed");
      }

      const data = await response.json();

      console.log("================================");
      console.log("BACKEND RESPONSE:");
      console.log(data);
      console.log("================================");

      setResult(data);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      setError(
        "Could not analyze the recording. Please make sure the backend is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Convert seconds into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Get stress label
  const getStressLabel = (score) => {
    if (score === null || score === undefined) {
      return "Unavailable";
    }

    const numericScore = Number(score);

    if (numericScore < 30) {
      return "Low";
    }

    if (numericScore < 60) {
      return "Moderate";
    }

    return "High";
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const stressScore = result?.acoustic_stress_score;
  const stressLabel = getStressLabel(stressScore);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 mb-3 text-primary-dark">
          <span className="text-2xl">🎙️</span>
        </div>

        <h2 className="text-2xl font-bold text-primary-dark mb-1">
          Speech Analytics & Voice Biomarkers
        </h2>

        <p className="text-xs text-text-muted max-w-xl mx-auto">
          Record your voice narrative to extract acoustic stress biomarkers (pitch, micro-tremors, jitter & pause ratio).
        </p>
      </div>

      {/* Main Recording Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted mb-1">
              Recording Status
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-primary"
                }`}
              />

              <span className="text-xs font-bold text-primary-dark">
                {isRecording ? "Recording Active..." : "Ready to Record"}
              </span>
            </div>
          </div>

          <div
            className={`text-xl font-mono font-bold ${
              isRecording ? "text-risk-high" : "text-primary-dark"
            }`}
          >
            {formatTime(duration)}
          </div>
        </div>

        {/* Waveform Canvas Box */}
        <div className="h-28 rounded-2xl bg-background border border-border flex items-center justify-center overflow-hidden">
          {isRecording ? (
            <div className="flex items-center justify-center gap-1 h-16 w-full px-6">
              {Array.from({ length: 45 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-primary animate-wave-bar"
                  style={{
                    animationDelay: `${index * 0.04}s`,
                    height: `${16 + ((index * 17) % 40)}px`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 opacity-40">
              {Array.from({ length: 45 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-border"
                  style={{
                    height: `${8 + ((index * 11) % 18)}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isAnalyzing}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-all shadow-sm hover:shadow disabled:opacity-50"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                🎙️
              </span>

              <span>
                {isAnalyzing ? "Analyzing Audio..." : "Start Recording"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                ⏹
              </span>

              <span>Stop & Analyze</span>
            </button>
          )}
        </div>

        {/* Recording Hint */}
        {!isRecording && !audioURL && !isAnalyzing && (
          <p className="text-center text-xs text-text-muted">
            Speak naturally for a few seconds. Audio feature extraction is processed in memory.
          </p>
        )}
      </div>

      {/* Audio Preview Box */}
      {audioURL && (
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-primary font-bold">
                Audio Preview
              </p>

              <h3 className="text-base font-bold text-primary-dark">
                Your Recorded Audio
              </h3>
            </div>

            <span className="text-xl">🔊</span>
          </div>

          <audio
            controls
            src={audioURL}
            className="w-full"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

            <div>
              <h3 className="text-sm font-bold text-primary-dark">
                Analyzing Speech Biomarkers...
              </h3>

              <p className="text-xs text-text-muted">
                Extracting acoustic features via librosa/scipy...
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-risk-low font-semibold">
              <span>✓</span>
              <span>Audio Blob Received</span>
            </div>

            <div className="flex items-center gap-2 text-risk-low font-semibold">
              <span>✓</span>
              <span>FFmpeg WAV Conversion Complete</span>
            </div>

            <div className="flex items-center gap-2 text-primary-dark font-medium animate-pulse">
              <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Evaluating Pitch, Jitter & Acoustic Stress Index</span>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-risk-high-bg border border-risk-high/40 text-risk-high">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>

            <div>
              <h3 className="font-bold text-xs mb-0.5">
                Analysis Notice
              </h3>

              <p className="text-xs text-text-muted">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !isAnalyzing && (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-primary font-bold">
              ANALYSIS COMPLETE
            </p>

            <h3 className="text-xl font-bold text-primary-dark">
              Acoustic Speech Analysis Results
            </h3>

            <p className="text-xs text-text-muted">
              Biomarker features extracted from your voice stream.
            </p>
          </div>

          {/* Main Cards Grid */}
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stress */}
              <div className="rounded-2xl bg-background border border-border p-5 text-center space-y-2">
                <p className="text-xs font-semibold text-text-muted">
                  Acoustic Stress Score
                </p>

                <div className="text-4xl font-black text-primary-dark font-mono">
                  {stressScore ?? "—"}
                </div>

                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                  stressLabel === 'High'
                    ? 'bg-risk-high-bg text-risk-high border-risk-high/40'
                    : stressLabel === 'Moderate'
                    ? 'bg-risk-mod-bg text-risk-mod border-risk-mod/40'
                    : 'bg-risk-low-bg text-risk-low border-risk-low/40'
                }`}>
                  {stressLabel} Stress
                </div>
              </div>

              {/* Confidence */}
              <div className="rounded-2xl bg-background border border-border p-5 space-y-2">
                <p className="text-xs font-semibold text-text-muted">
                  Model Confidence
                </p>

                <div className="text-2xl font-bold text-primary-dark font-mono">
                  {result.confidence ?? "—"}
                </div>

                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(result.confidence) || 0)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Uncertainty */}
              <div className="rounded-2xl bg-background border border-border p-5 space-y-2">
                <p className="text-xs font-semibold text-text-muted">
                  Uncertainty Level
                </p>

                <div className="text-2xl font-bold text-primary-dark font-mono">
                  {result.uncertainty ?? "—"}
                </div>

                <p className="text-[11px] text-text-muted">
                  Acoustic confidence margin
                </p>
              </div>
            </div>

            {/* Interpretation Box */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>

                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-primary-dark">
                    What This Means
                  </h4>

                  <p className="text-xs leading-relaxed text-text">
                    Your voice recording exhibits{" "}
                    <strong className="text-primary-dark">
                      {stressLabel.toLowerCase()}
                    </strong>{" "}
                    acoustic stress characteristics based on vocal pitch stability and micro-tremor variance.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-text-muted text-center">
              This analysis evaluates acoustic speech characteristics to prioritize assistance and is not a medical diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;


