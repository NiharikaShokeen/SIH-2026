
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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <span className="text-3xl">🎙️</span>
        </div>

        <h2 className="text-3xl font-bold text-text mb-2">
          Voice Analysis
        </h2>

        <p className="text-text-muted max-w-xl mx-auto">
          Record your voice and let our system analyze acoustic speech
          characteristics.
        </p>
      </div>

      {/* Main Recording Card */}
      <div className="glass-panel-luxury rounded-3xl p-6 md:p-8">
        {/* Status */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-text-muted mb-1">
              Recording status
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-primary"
                }`}
              />

              <span className="text-text font-medium">
                {isRecording ? "Recording..." : "Ready to record"}
              </span>
            </div>
          </div>

          <div
            className={`text-2xl font-mono font-semibold ${
              isRecording ? "text-risk-critical" : "text-text"
            }`}
          >
            {formatTime(duration)}
          </div>
        </div>

        {/* Waveform */}
        <div className="h-32 rounded-2xl bg-background border border-border flex items-center justify-center overflow-hidden mb-8">
          {isRecording ? (
            <div className="flex items-center justify-center gap-1 h-20 w-full px-6">
              {Array.from({ length: 45 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-primary animate-wave-bar"
                  style={{
                    animationDelay: `${index * 0.04}s`,
                    height: `${20 + ((index * 17) % 45)}px`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 opacity-50">
              {Array.from({ length: 45 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-primary"
                  style={{
                    height: `${16 + ((index * 13) % 32)}px`,
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
              className="group flex items-center gap-3 px-7 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                🎙️
              </span>

              <span>
                {isAnalyzing ? "Analyzing..." : "Start Recording"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="group flex items-center gap-3 px-7 py-4 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-red-500/20"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                ⏹
              </span>

              <span>Stop & Analyze</span>
            </button>
          )}
        </div>

        {/* Recording Hint */}
        {!isRecording && !audioURL && !isAnalyzing && (
          <p className="text-center text-sm text-text-muted mt-5">
            Speak naturally for a few seconds for better analysis.
          </p>
        )}
      </div>

      {/* Audio Preview */}
      {audioURL && (
        <div className="glass-card-hover rounded-3xl p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                Audio Preview
              </p>

              <h3 className="text-xl font-semibold text-text mt-1">
                Your Recording
              </h3>
            </div>

            <span className="text-2xl">🔊</span>
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
        <div className="glass-card-hover rounded-3xl p-6 mt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

            <div>
              <h3 className="text-lg font-semibold text-text">
                Analyzing your speech
              </h3>

              <p className="text-sm text-text-muted">
                Processing your recording...
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-emerald-400">✓</span>
              <span className="text-text">
                Audio received
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-300">
                Acoustic features extracted
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-text">
                Evaluating vocal patterns
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-5 rounded-2xl bg-risk-critical-bg border border-risk-critical/30">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>

            <div>
              <h3 className="font-semibold text-risk-critical mb-1">
                Analysis failed
              </h3>

              <p className="text-sm text-text-muted">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="mt-8">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">
              Analysis Complete
            </p>

            <h3 className="text-2xl font-bold text-text mt-1">
              Speech Analysis
            </h3>

            <p className="text-sm text-text-muted mt-1">
              Acoustic characteristics detected from your recording.
            </p>
          </div>

          {/* Main Score */}
          <div className="glass-panel-luxury rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Stress */}
              <div className="md:col-span-1 rounded-2xl bg-surface border border-border p-6 text-center">
                <p className="text-sm text-text-muted mb-3">
                  Acoustic Stress
                </p>

                <div className="text-5xl font-bold text-text mb-2">
                  {stressScore ?? "—"}
                </div>

                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  {stressLabel}
                </div>
              </div>

              {/* Confidence */}
              <div className="rounded-2xl bg-surface border border-border p-6">
                <p className="text-sm text-text-muted mb-3">
                  Confidence
                </p>

                <div className="text-3xl font-bold text-text mb-4">
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
              <div className="rounded-2xl bg-surface border border-border p-6">
                <p className="text-sm text-text-muted mb-3">
                  Uncertainty
                </p>

                <div className="text-3xl font-bold text-text mb-2">
                  {result.uncertainty ?? "—"}
                </div>

                <p className="text-sm text-text-muted">
                  Model uncertainty level
                </p>
              </div>
            </div>

            {/* Interpretation */}
            <div className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>

                <div>
                  <h4 className="font-semibold text-text mb-1">
                    What this means
                  </h4>

                  <p className="text-sm leading-relaxed text-text-muted">
                    Your recording shows{" "}
                    <span className="text-primary font-medium">
                      {stressLabel.toLowerCase()}
                    </span>{" "}
                    acoustic stress characteristics based on the detected
                    vocal patterns.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-text-muted text-center mt-6">
              This analysis evaluates acoustic speech characteristics and
              is not a medical or psychological diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;


