import { useRef, useState, useEffect, useCallback } from "react";

/**
 * FacialMonitor
 *
 * - Captures a still snapshot from the victim's webcam every SNAPSHOT_INTERVAL_MS
 *   (NOT a continuous video stream — matches the "no raw media retained" design).
 * - Requires explicit opt-in consent, separate from text/voice consent.
 * - Sends only the single frame to the backend for scoring; nothing is
 *   stored client-side beyond the current preview frame.
 * - Shows a Critical banner and stops auto-capturing once an alert fires,
 *   so the same distress frame isn't repeatedly escalated.
 *
 * Backend: POST {apiBase}/facial-assessment  (multipart/form-data: session_id, frame)
 */

const SNAPSHOT_INTERVAL_MS = 4000;

export default function FacialMonitor({ sessionId, apiBase = "/api" }) {
  const [consent, setConsent] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [alertActive, setAlertActive] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreaming(true);
      setError(null);
    } catch (err) {
      setError("Camera access denied or unavailable.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, []);

  const captureAndSend = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const form = new FormData();
      form.append("session_id", sessionId);
      form.append("frame", blob, "frame.jpg");

      try {
        const res = await fetch(`${apiBase}/facial-assessment`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error("assessment request failed");
        const data = await res.json();
        setLastResult(data);
        if (data.alert_triggered) {
          setAlertActive(true);
          // stop auto-capture once escalated; a human takes it from here
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err) {
        setError("Could not reach assessment service.");
      }
    }, "image/jpeg", 0.85);
  }, [sessionId, apiBase]);

  useEffect(() => {
    if (consent && streaming && !alertActive) {
      intervalRef.current = setInterval(captureAndSend, SNAPSHOT_INTERVAL_MS);
      return () => clearInterval(intervalRef.current);
    }
  }, [consent, streaming, alertActive, captureAndSend]);

  useEffect(() => stopCamera, [stopCamera]);

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 text-text shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-primary-dark flex items-center space-x-2">
          <span>📷</span>
          <span>Facial Distress Signal (Completely Optional)</span>
        </h3>
        <label className="flex items-center gap-2 text-xs font-medium text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              const on = e.target.checked;
              setConsent(on);
              if (on) startCamera();
              else stopCamera();
            }}
            className="accent-primary rounded"
          />
          <span>Consent to Facial Analysis</span>
        </label>
      </div>

      {alertActive && (
        <div className="rounded-2xl border border-risk-high/40 bg-risk-high-bg p-3 text-xs text-risk-high font-semibold">
          Critical distress signal detected. Connecting you to a human counsellor now. Please stay on this screen.
        </div>
      )}

      {consent && streaming && !alertActive && (
        <div className="rounded-2xl border border-border bg-background p-3 text-xs text-text-muted">
          Facial assessment is passive and operates in memory — frames are analyzed and immediately discarded.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full rounded-2xl border border-border bg-background ${
            consent ? "block" : "hidden"
          }`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {lastResult && (
          <div className="rounded-2xl border border-border bg-background p-3 text-xs space-y-1">
            <div className="text-text-muted font-semibold">Last Facial Signal:</div>
            {lastResult.modality_available ? (
              <>
                <div className="text-primary-dark font-bold">Dominant: {lastResult.dominant_emotion ?? "—"}</div>
                <div className="text-text font-mono">Score: {lastResult.score?.toFixed?.(0) ?? 0}/100</div>
              </>
            ) : (
              <div className="text-text-muted">
                {lastResult.reasons?.[0] ?? "modality unavailable"}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-risk-high font-semibold">{error}</p>}

      {!consent && (
        <p className="text-[11px] text-text-muted leading-relaxed">
          Facial analysis is optional and off by default. Enabling starts your camera; frames are analyzed in-memory and discarded — zero raw media retained or stored.
        </p>
      )}
    </div>
  );
}