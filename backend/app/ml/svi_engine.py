from typing import Dict, Any, List, Optional


class GlassBoxSVIEngine:
    

    def __init__(self):
        
        self.w_acoustic = 0.30
        self.w_linguistic = 0.40
        self.w_facial = 0.10
        self.w_context = 0.12
        self.w_trend = 0.08

    def _active_weights(self, has_audio: bool, has_facial: bool) -> Dict[str, float]:
        base = {
            "acoustic": self.w_acoustic if has_audio else 0.0,
            "linguistic": self.w_linguistic,     # text/linguistic always present
            "facial": self.w_facial if has_facial else 0.0,
            "context": self.w_context,
            "trend": self.w_trend,
        }
        total = sum(base.values())
        if total == 0:
            return base
        return {k: v / total for k, v in base.items()}

    def calculate_svi(
        self,
        acoustic_score: Optional[float] = None,
        linguistic_score: float = 40.0,
        facial_score: Optional[float] = None,
        facial_pain_flag: bool = False,
        context_factors: Dict[str, Any] = None,
        historical_scores: List[float] = None,
    ) -> Dict[str, Any]:

        has_audio = acoustic_score is not None
        has_facial = facial_score is not None

        weights = self._active_weights(has_audio, has_facial)
        w_a, w_l, w_f = weights["acoustic"], weights["linguistic"], weights["facial"]
        w_c, w_t = weights["context"], weights["trend"]

        a_val = float(acoustic_score) if has_audio else 0.0
        l_val = float(linguistic_score)
        f_val = float(facial_score) if has_facial else 0.0

        # 2. Contextual Risk Score computation (0-100)
        c_factors = context_factors or {}
        c_score = 30.0  # base context score
        if c_factors.get("is_woman_or_child", False):
            c_score += 15.0
        if c_factors.get("is_repeat_harassment", False):
            c_score += 20.0
        if c_factors.get("police_fir_refused", False):
            c_score += 15.0
        if c_factors.get("perpetrator_in_power", False):
            c_score += 20.0
        c_val = min(100.0, c_score)

        # 3. Longitudinal Trend Score computation (0-100)
        t_val = 20.0
        trend_direction = "Stable"
        if historical_scores and len(historical_scores) > 0:
            last_score = historical_scores[-1]
            prev_avg = sum(historical_scores) / len(historical_scores)
            if last_score > prev_avg + 10.0:
                t_val = min(100.0, last_score + 15.0)
                trend_direction = "Rapidly Escalating Trauma Trend"
            elif last_score < prev_avg - 10.0:
                t_val = max(0.0, last_score - 10.0)
                trend_direction = "De-escalating / Stabilizing"

        # 4. Synthesize Composite SVI
        raw_svi = (w_a * a_val) + (w_l * l_val) + (w_f * f_val) + (w_c * c_val) + (w_t * t_val)
        svi_score = round(min(100.0, max(0.0, raw_svi)), 1)

        # 5. Risk Categorization
        # Critical overrides: a direct suicidal-ideation flag OR a facial
        # pain-proxy flag both force Critical regardless of the blended
        # score — neither should get diluted by calmer signals elsewhere.
        # This still requires human confirmation downstream (alert_service.py);
        # it is not an autonomous escalation.
        critical_override = (
            c_factors.get("has_suicidal_flag", False) or facial_pain_flag
        )

        if svi_score >= 76.0 or critical_override:
            risk_category = "CRITICAL"
            color_code = "#EF4444"  # Red
            sla_minutes = 15
        elif svi_score >= 51.0:
            risk_category = "HIGH"
            color_code = "#F97316"  # Orange
            sla_minutes = 60
        elif svi_score >= 26.0:
            risk_category = "MODERATE"
            color_code = "#F59E0B"  # Amber
            sla_minutes = 240
        else:
            risk_category = "LOW"
            color_code = "#10B981"  # Green
            sla_minutes = 1440  # 24 hrs

        if critical_override:
            svi_score = max(svi_score, 90.0)

        # 6. Glass-Box Rationale (Explainability breakdown for audit)
        rationale_points = []
        if has_audio:
            rationale_points.append(
                f"Acoustic Vocal Stress contributes {round(w_a * a_val, 1)} pts ({round(a_val, 1)}/100 raw)."
            )
        rationale_points.append(
            f"Linguistic Trauma & Sentiment contributes {round(w_l * l_val, 1)} pts ({round(l_val, 1)}/100 raw)."
        )
        if has_facial:
            rationale_points.append(
                f"Facial Distress Signal contributes {round(w_f * f_val, 1)} pts ({round(f_val, 1)}/100 raw)."
            )
            if facial_pain_flag:
                rationale_points.append(
                    "Facial pain-proxy pattern detected — this alone forces CRITICAL "
                    "tier pending human confirmation, independent of the blended score."
                )
        rationale_points.append(
            f"Contextual Atrocity Severity contributes {round(w_c * c_val, 1)} pts ({round(c_val, 1)}/100 raw)."
        )
        rationale_points.append(
            f"Longitudinal Risk Trend contributes {round(w_t * t_val, 1)} pts ({trend_direction})."
        )
        if c_factors.get("has_suicidal_flag", False):
            rationale_points.append(
                "Suicidal-ideation flag detected — this alone forces CRITICAL tier "
                "pending human confirmation, independent of the blended score."
            )

        return {
            "svi_score": svi_score,
            "risk_category": risk_category,
            "color_code": color_code,
            "sla_response_minutes": sla_minutes,
            "critical_override_triggered": critical_override,
            "weights_used": {
                "acoustic_weight": round(w_a, 3),
                "linguistic_weight": round(w_l, 3),
                "facial_weight": round(w_f, 3),
                "context_weight": round(w_c, 3),
                "trend_weight": round(w_t, 3),
            },
            "sub_scores": {
                "acoustic_stress": round(a_val, 1) if has_audio else None,
                "linguistic_trauma": round(l_val, 1),
                "facial_distress": round(f_val, 1) if has_facial else None,
                "contextual_risk": round(c_val, 1),
                "longitudinal_trend": round(t_val, 1),
            },
            "trend_direction": trend_direction,
            "explainable_rationale": rationale_points,
        }


svi_engine = GlassBoxSVIEngine()