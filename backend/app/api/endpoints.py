from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import time

from app.ml.speech_processor import speech_engine
from app.ml.nlp_processor import nlp_engine
from app.ml.svi_engine import svi_engine
from app.ml.recommendation_engine import recommendation_engine
from app.ml.fairness_auditor import fairness_auditor
from app.data.sample_cases import SAMPLE_CASES

from app.ml.facial_processor import FacialProcessor
from app.core.alert_service import trigger_human_alert

router = APIRouter()


# In-memory session case store for demo
cases_db = list(SAMPLE_CASES)
consent_ledger = []

class TextAnalysisRequest(BaseModel):
    text: str
    language_code: Optional[str] = "auto"

class FullAssessmentRequest(BaseModel):
    channel: str = "Chatbot Intake"
    language_code: str = "auto"
    complaint_text: str
    prosody_override: Optional[Dict[str, float]] = None
    context_factors: Optional[Dict[str, Any]] = None
    historical_svi: Optional[List[float]] = None
    consent_given: bool = True

class ConsentRequest(BaseModel):
    session_id: str
    user_id: str
    channel: str
    consent_scope: List[str]

@router.get("/health")
def health_check():
    return {"status": "online", "system": "NHAA 14566 AI Stress & Trauma Assessment Engine", "timestamp": time.time()}

@router.get("/cases")
def get_all_cases():
    return {"cases": cases_db, "count": len(cases_db)}

@router.post("/analyze/text")
def analyze_text(req: TextAnalysisRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text narrative cannot be empty")
    return nlp_engine.analyze_narrative(req.text, req.language_code)

@router.post("/analyze/speech")
def analyze_speech(custom_prosody: Optional[Dict[str, float]] = None):
    return speech_engine.analyze_audio_features(custom_prosody=custom_prosody)

@router.post("/assess")
def full_trauma_assessment(req: FullAssessmentRequest):
    # 1. Speech Analytics
    speech_res = speech_engine.analyze_audio_features(custom_prosody=req.prosody_override)
    
    # 2. Text/NLP Analytics
    nlp_res = nlp_engine.analyze_narrative(req.complaint_text, req.language_code)
    
    # Enrich context factors with NLP suicidal flag
    ctx = req.context_factors or {}
    if nlp_res["entities"]["has_suicidal_flag"]:
        ctx["has_suicidal_flag"] = True

    # 3. Glass-Box SVI Engine Calculation
    svi_res = svi_engine.calculate_svi(
        acoustic_score=speech_res["acoustic_stress_score"],
        linguistic_score=nlp_res["linguistic_trauma_score"],
        context_factors=ctx,
        historical_scores=req.historical_svi or [40.0, 52.0]
    )

    # 4. Auto-Recommendation Engine
    recommendations = recommendation_engine.generate_recommendations(svi_res, nlp_res)

    # 5. Silent Escalation Trigger check
    silent_escalation_triggered = (
        svi_res["risk_category"] == "CRITICAL" or nlp_res["entities"]["has_suicidal_flag"]
    )

    # Save to memory case store
    new_case = {
        "case_id": f"NHAA-2026-{len(cases_db) + 8000}",
        "victim_name": "Anonymous Complainant",
        "channel": req.channel,
        "language": nlp_res["detected_language"],
        "district": "Intake Control Room",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "complaint_text": req.complaint_text,
        "svi_score": svi_res["svi_score"],
        "risk_category": svi_res["risk_category"],
        "color_code": svi_res["color_code"],
        "silent_escalation": silent_escalation_triggered,
        "speech_analysis": speech_res,
        "nlp_analysis": nlp_res,
        "svi_analysis": svi_res,
        "recommendations": recommendations
    }
    cases_db.insert(0, new_case)

    return {
        "case_id": new_case["case_id"],
        "silent_escalation": silent_escalation_triggered,
        "speech_analysis": speech_res,
        "nlp_analysis": nlp_res,
        "svi_analysis": svi_res,
        "recommendations": recommendations
    }

@router.post("/consent")
def record_consent(req: ConsentRequest):
    record = {
        "consent_id": f"CNS-{len(consent_ledger)+101}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "session_id": req.session_id,
        "user_id": req.user_id,
        "channel": req.channel,
        "scope": req.consent_scope,
        "status": "ACTIVE_GRANTED"
    }
    consent_ledger.append(record)
    return {"status": "SUCCESS", "record": record}

@router.get("/fairness")
def get_fairness_report():
    return fairness_auditor.get_bias_audit_report()

facial_processor = FacialProcessor()


@router.post("/facial-assessment")
async def facial_assessment(
    session_id: str = Form(...),
    frame: UploadFile = File(...),
):
    """
    Accepts a SINGLE snapshot frame (not a video stream) from the frontend's
    periodic capture. Frame bytes are processed in-memory only — never
    written to disk — consistent with the no-raw-media-retained design.
    """
    frame_bytes = await frame.read()
    result = facial_processor.process_frame(frame_bytes)
 
    response = {
        "session_id": session_id,
        "modality_available": result.modality_available,
        "score": result.score,
        "dominant_emotion": result.dominant_emotion,
        "pain_proxy_flag": result.pain_proxy_flag,
        "reasons": result.reasons,
        "alert_triggered": False,
    }
 
    # Critical override: pain-adjacent expression escalates immediately,
    # same pattern as the critical-text-phrase override in svi_engine.py.
    # This still routes to a HUMAN for confirmation — it does not auto-
    # dispatch police or take irreversible action on its own.
    if result.pain_proxy_flag:
        alert = trigger_human_alert(
            session_id=session_id,
            svi=result.score,
            category="Critical",
            reasons=result.reasons,
            triggered_by="facial:pain_proxy",
        )
        response["alert_triggered"] = True
        response["alert_id"] = alert.alert_id
 
    return response
 
 
@router.get("/alerts/active")
async def get_active_alerts_endpoint():
    """Feeds the 'Officer Control Room' tab in your frontend header."""
    from app.core.alert_service import get_active_alerts
    return [a.__dict__ for a in get_active_alerts()]
