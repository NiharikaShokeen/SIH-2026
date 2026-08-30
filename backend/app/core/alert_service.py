"""
app/core/alert_service.py

Handles escalation when SVI fusion (any modality) returns Critical.

Deliberately does NOT auto-dial police or take irreversible action.
It notifies a live human (Officer Control Room / on-call counsellor)
and logs the event — a human confirms next steps. This matches the
"human-in-the-loop for Critical tier" design from the pitch.

Swap the notify_* stub functions for real integrations:
- notify_officer_console -> push via WebSocket to your "Officer Control
  Room" frontend view (you already have this tab in the UI)
- notify_call_queue -> Twilio Voice / Programmable Voice API to ring
  an on-call counsellor's phone
- notify_sms -> Twilio SMS / MSG91 (common in Indian gov deployments)
"""

from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
import uuid


class AlertChannel(str, Enum):
    OFFICER_CONSOLE = "officer_console"
    CALL_QUEUE = "call_queue"
    SMS = "sms"


@dataclass
class AlertEvent:
    alert_id: str
    session_id: str
    triggered_by: str          # e.g. "facial:pain_proxy", "text:critical_phrase"
    svi: float
    category: str
    reasons: list
    timestamp: str
    acknowledged: bool = False


# In-memory store for the prototype. Replace with a DB table
# (e.g. alerts table in your existing data layer) for production —
# note this stores the SVI/category/reasons only, never raw media.
_ALERT_LOG: list[AlertEvent] = []


def trigger_human_alert(
    session_id: str,
    svi: float,
    category: str,
    reasons: list,
    triggered_by: str,
    channels: Optional[list[AlertChannel]] = None,
) -> AlertEvent:
    """Fire an escalation. Only called for Critical (and optionally High)
    tier results. Returns the AlertEvent so the API layer can surface it
    to the frontend (e.g. drive the 'connecting to human counsellor' banner).
    """
    channels = channels or [AlertChannel.OFFICER_CONSOLE, AlertChannel.CALL_QUEUE]

    event = AlertEvent(
        alert_id=str(uuid.uuid4()),
        session_id=session_id,
        triggered_by=triggered_by,
        svi=svi,
        category=category,
        reasons=reasons,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    _ALERT_LOG.append(event)

    if AlertChannel.OFFICER_CONSOLE in channels:
        _notify_officer_console(event)
    if AlertChannel.CALL_QUEUE in channels:
        _notify_call_queue(event)
    if AlertChannel.SMS in channels:
        _notify_sms(event)

    return event


def get_active_alerts() -> list[AlertEvent]:
    return [a for a in _ALERT_LOG if not a.acknowledged]


def acknowledge_alert(alert_id: str) -> bool:
    for a in _ALERT_LOG:
        if a.alert_id == alert_id:
            a.acknowledged = True
            return True
    return False


# --- stub integrations: wire these to real channels ---

def _notify_officer_console(event: AlertEvent) -> None:
    # TODO: push over WebSocket to the "Officer Control Room" tab shown
    # in your frontend header. For the prototype this is just a print/log.
    print(f"[OFFICER CONSOLE ALERT] {event.category} — session {event.session_id} "
          f"— svi={event.svi} — reason={event.triggered_by}")


def _notify_call_queue(event: AlertEvent) -> None:
    # TODO: Twilio/telephony integration to ring the on-call counsellor.
    print(f"[CALL QUEUE] Ringing on-call counsellor for session {event.session_id}")


def _notify_sms(event: AlertEvent) -> None:
    # TODO: SMS gateway integration.
    print(f"[SMS] Alerting duty officer for session {event.session_id}")

