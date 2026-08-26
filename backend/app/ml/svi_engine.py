from typing import Dict, Any, List

class GlassBoxSVIEngine:
    """
    Glass-Box Stress Vulnerability Index (SVI) Fusion Engine.
    Combines Acoustic Stress (A), Linguistic Trauma (L), Contextual Risk (C),
    and Historical Longitudinal Trend (H) into an explainable 0-100 score.
    """
    def __init__(self):
        # Default Weights
        self.w_acoustic = 0.35
        self.w_linguistic = 0.45
        self.w_context = 0.12
        self.w_trend = 0.08

    def calculate_svi(
        self,
        acoustic_score: float = None,
        linguistic_score: float = 40.0,
        context_factors: Dict[str, Any] = None,
        historical_scores: List[float] = None
    ) -> Dict[str, Any]:
        
        # 1. Acoustic Score normalize
        has_audio = acoustic_score is not None
        if not has_audio:
            # Adjust weights if text-only intake
            w_a = 0.0
            w_l = 0.70
            w_c = 0.20
            w_t = 0.10
            a_val = 0.0
        else:
            w_a = self.w_acoustic
            w_l = self.w_linguistic
            w_c = self.w_context
            w_t = self.w_trend
            a_val = float(acoustic_score)

        l_val = float(linguistic_score)

        # 2. Contextual Risk Score computation (0-100)
        c_factors = context_factors or {}
        c_score = 30.0 # base context score
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
        raw_svi = (w_a * a_val) + (w_l * l_val) + (w_c * c_val) + (w_t * t_val)
        svi_score = round(min(100.0, max(0.0, raw_svi)), 1)

        # 5. Risk Categorization
        if svi_score >= 76.0 or (c_factors.get("has_suicidal_flag", False)):
            risk_category = "CRITICAL"
            color_code = "#EF4444" # Red
            sla_minutes = 15
        elif svi_score >= 51.0:
            risk_category = "HIGH"
            color_code = "#F97316" # Orange
            sla_minutes = 60
        elif svi_score >= 26.0:
            risk_category = "MODERATE"
            color_code = "#F59E0B" # Amber
            sla_minutes = 240
        else:
            risk_category = "LOW"
            color_code = "#10B981" # Green
            sla_minutes = 1440 # 24 hrs

        # 6. Glass-Box Rationale (Explainability breakdown for audit)
        rationale_points = []
        if has_audio:
            rationale_points.append(f"Acoustic Vocal Stress contributes {round(w_a * a_val, 1)} pts ({round(a_val, 1)}/100 raw).")
        rationale_points.append(f"Linguistic Trauma & Sentiment contributes {round(w_l * l_val, 1)} pts ({round(l_val, 1)}/100 raw).")
        rationale_points.append(f"Contextual Atrocity Severity contributes {round(w_c * c_val, 1)} pts ({round(c_val, 1)}/100 raw).")
        rationale_points.append(f"Longitudinal Risk Trend contributes {round(w_t * t_val, 1)} pts ({trend_direction}).")

        return {
            "svi_score": svi_score,
            "risk_category": risk_category,
            "color_code": color_code,
            "sla_response_minutes": sla_minutes,
            "weights_used": {
                "acoustic_weight": w_a,
                "linguistic_weight": w_l,
                "context_weight": w_c,
                "trend_weight": w_t
            },
            "sub_scores": {
                "acoustic_stress": round(a_val, 1) if has_audio else None,
                "linguistic_trauma": round(l_val, 1),
                "contextual_risk": round(c_val, 1),
                "longitudinal_trend": round(t_val, 1)
            },
            "trend_direction": trend_direction,
            "explainable_rationale": rationale_points
        }

svi_engine = GlassBoxSVIEngine()
