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
      intervalRef.current = setInterval(
        captureAndSend,
        SNAPSHOT_INTERVAL_MS
      );
      return () => clearInterval(intervalRef.current);
    }
  }, [consent, streaming, alertActive, captureAndSend]);

  useEffect(() => stopCamera, [stopCamera]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-text">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">
          Facial Distress Signal (completely optional)
        </h3>

        <label className="flex items-center gap-2 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              const on = e.target.checked;
              setConsent(on);
              if (on) startCamera();
              else stopCamera();
            }}
            className="accent-primary"
          />
          I consent to facial analysis
        </label>
      </div>

      {alertActive && (
        <div className="mb-3 rounded-xl border border-risk-critical/30 bg-risk-critical-bg p-3 text-sm text-risk-critical">
          <strong>Critical signal detected.</strong> Connecting you to a human
          counsellor now — this is not automated further. Please stay on this
          screen.
        </div>
      )}

      {consent && streaming && !alertActive && (
        <div className="mb-3 rounded-xl border border-border bg-background p-3 text-xs text-text-muted">
          Assessment is passive and runs in the background — you do not need
          to do anything.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full rounded-xl border border-border ${
            consent ? "block" : "hidden"
          }`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {lastResult && (
          <div className="rounded-xl border border-border bg-background p-3 text-xs text-text">
            <div className="mb-1 text-text-muted">Last signal</div>

            {lastResult.modality_available ? (
              <>
                <div>Dominant: {lastResult.dominant_emotion ?? "—"}</div>
                <div>
                  Score: {lastResult.score?.toFixed?.(0) ?? 0}/100
                </div>
              </>
            ) : (
              <div className="text-text-muted">
                {lastResult.reasons?.[0] ?? "modality unavailable"}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-risk-critical">
          {error}
        </p>
      )}

      {!consent && (
        <p className="mt-2 text-xs text-text-muted">
          Facial analysis is optional and off by default. Enabling it starts
          your camera; frames are analyzed and discarded — not stored or
          streamed continuously.
        </p>
      )}
    </div>
  );
}